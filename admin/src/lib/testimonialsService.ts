/**
 * Firestore CRUD helpers for the "testimonials" collection.
 *
 * Each document represents a customer testimonial displayed on the storefront.
 * Schema:
 *   name:    string  – customer name
 *   title:   string  – customer role/title
 *   quote:   string  – testimonial text
 *   order:   number  – display order (ascending)
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

export const TESTIMONIALS_COLLECTION = "testimonials";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  order: number;
}

export interface FirestoreTestimonialDoc extends Omit<Testimonial, "id"> {
  createdAt?: Timestamp;
}

function toTestimonial(snap: QueryDocumentSnapshot<DocumentData>): Testimonial {
  const data = snap.data() as FirestoreTestimonialDoc;
  const { createdAt: _ts, ...rest } = data;
  return { id: snap.id, ...rest } as Testimonial;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const q = query(
    collection(db, TESTIMONIALS_COLLECTION),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toTestimonial);
}

export async function addTestimonial(
  data: Omit<Testimonial, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTestimonial(
  id: string,
  data: Omit<Testimonial, "id">
): Promise<void> {
  await updateDoc(doc(db, TESTIMONIALS_COLLECTION, id), { ...data });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
}
