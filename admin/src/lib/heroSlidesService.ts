/**
 * Firestore CRUD helpers for the "heroSlides" collection.
 *
 * Each document represents one slide in the homepage hero carousel.
 * Schema:
 *   bg:       string  – background image URL
 *   tag:      string  – small label above the title (e.g. "Fresh Arrivals")
 *   title:    string  – main heading
 *   subtitle: string  – short description
 *   cta:      string  – URL for the primary CTA button (e.g. "collections.html")
 *   order:    number  – display order (ascending)
 */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const HERO_SLIDES_COLLECTION = "heroSlides";

export interface HeroSlide {
  id: string;
  bg: string;
  tag: string;
  title: string;
  subtitle: string;
  cta: string;
  order: number;
}

export interface FirestoreHeroSlideDoc extends Omit<HeroSlide, "id"> {
  createdAt?: Timestamp;
}

function toHeroSlide(snap: QueryDocumentSnapshot<DocumentData>): HeroSlide {
  const data = snap.data() as FirestoreHeroSlideDoc;
  const { createdAt: _ts, ...rest } = data;
  return { id: snap.id, ...rest } as HeroSlide;
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const q = query(
    collection(db, HERO_SLIDES_COLLECTION),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toHeroSlide);
}

export async function addHeroSlide(
  data: Omit<HeroSlide, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, HERO_SLIDES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateHeroSlide(
  id: string,
  data: Omit<HeroSlide, "id">
): Promise<void> {
  await updateDoc(doc(db, HERO_SLIDES_COLLECTION, id), { ...data });
}

export async function deleteHeroSlide(id: string): Promise<void> {
  await deleteDoc(doc(db, HERO_SLIDES_COLLECTION, id));
}

/**
 * Upload a hero slide background image to Cloudinary using an unsigned upload preset.
 */
export async function uploadHeroSlideImage(
  file: File,
  timeoutMs = 30_000
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and " +
        "VITE_CLOUDINARY_UPLOAD_PRESET in your .env file (see example.env)."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "hero-slides");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const uploadPromise = fetch(uploadUrl, {
    method: "POST",
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
    }
    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) {
      throw new Error(
        "Cloudinary upload succeeded but the response did not contain a secure_url."
      );
    }
    return json.secure_url;
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Image upload timed out after ${timeoutMs / 1000}s.`)),
      timeoutMs
    )
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}
