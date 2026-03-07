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
