/**
 * Firestore CRUD helpers for the brand configuration document.
 *
 * The config is stored as a single document at:
 *   collection: "config"
 *   document:   "brand"
 */

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { brand } from "@/config/brand";

export const BRAND_CONFIG_COLLECTION = "config";
export const BRAND_CONFIG_DOC_ID = "brand";

export interface BrandConfig {
  brandName: string;
  tagline: string;
  subTagline: string;
  whatsappNumber: string;
  phone: string;
  location: string;
  email: string;
  heroImage: string;
  instagram: string;
  facebook: string;
  whatsappGreeting: string;
  whatsappClosing: string;
}

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandName: brand.brandName,
  tagline: brand.tagline,
  subTagline: brand.subTagline,
  whatsappNumber: brand.whatsappNumber,
  phone: brand.phone,
  location: brand.location,
  email: brand.email,
  heroImage: brand.heroImage,
  instagram: brand.instagram,
  facebook: brand.facebook,
  whatsappGreeting: brand.whatsappGreeting,
  whatsappClosing: brand.whatsappClosing,
};

export async function getBrandConfig(): Promise<BrandConfig | null> {
  const snap = await getDoc(
    doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID)
  );
  if (!snap.exists()) return null;
  const { updatedAt: _ts, ...rest } = snap.data() as BrandConfig & {
    updatedAt?: unknown;
  };
  return rest as BrandConfig;
}

export async function saveBrandConfig(data: BrandConfig): Promise<void> {
  await setDoc(
    doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID),
    { ...data, updatedAt: serverTimestamp() }
  );
}

export async function resetBrandConfig(): Promise<void> {
  await deleteDoc(doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID));
}
