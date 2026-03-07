/**
 * Firestore CRUD helpers for the "flowers" collection.
 *
 * Collection schema mirrors the FlowerProduct interface from @/data/products,
 * with an additional `createdAt` server timestamp added on write.
 */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FlowerProduct } from "@/data/products";

export const PRODUCTS_COLLECTION = "flowers";

/**
 * Remove keys whose value is `undefined` before writing to Firestore.
 * Firestore does not support undefined field values and throws if any are present.
 */
function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  );
}

export interface FirestoreFlowerDoc extends Omit<FlowerProduct, "id"> {
  createdAt?: Timestamp;
}

function toProduct(snap: QueryDocumentSnapshot<DocumentData>): FlowerProduct {
  const data = snap.data() as FirestoreFlowerDoc;
  const { createdAt: _ts, ...rest } = data;
  return { id: snap.id, ...rest } as FlowerProduct;
}

export async function addProduct(data: Omit<FlowerProduct, "id">): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...stripUndefined(data as Record<string, unknown>),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getProducts(): Promise<FlowerProduct[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toProduct);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

export async function updateProduct(id: string, data: Omit<FlowerProduct, "id">): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
    ...stripUndefined(data as Record<string, unknown>),
  });
}

/**
 * Upsert a product document with a specific ID.
 * • If the document doesn't exist yet (first edit of a static flower), it is
 *   created with a server-side `createdAt` timestamp.
 * • If the document already exists, only the data fields are updated so that
 *   the original `createdAt` is preserved.
 */
export async function setProduct(id: string, data: Omit<FlowerProduct, "id">): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const snap = await getDoc(docRef);
  const payload = stripUndefined(data as Record<string, unknown>);
  if (snap.exists()) {
    await updateDoc(docRef, payload);
  } else {
    await setDoc(docRef, { ...payload, createdAt: serverTimestamp() });
  }
}

/**
 * Upload a product image to Cloudinary using an unsigned upload preset.
 */
export async function uploadProductImage(
  file: File,
  view: "front" | "left" | "right" | "back",
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
  formData.append("folder", "flowers");
  formData.append("tags", `view:${view}`);

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
      () =>
        reject(
          new Error(
            `Image upload timed out after ${timeoutMs / 1000}s.`
          )
        ),
      timeoutMs
    )
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}
