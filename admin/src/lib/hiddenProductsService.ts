/**
 * Firestore service for hiding/restoring static flower products.
 *
 * The set of hidden product IDs is persisted as:
 *   collection: "config"
 *   document:   "hiddenProducts"
 *   field:      hiddenIds: string[]
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, useCallback } from "react";

const HIDDEN_PRODUCTS_REF = doc(db, "config", "hiddenProducts");

export async function getHiddenProductIds(): Promise<string[]> {
  const snap = await getDoc(HIDDEN_PRODUCTS_REF);
  if (!snap.exists()) return [];
  const data = snap.data() as { hiddenIds?: string[] };
  return data.hiddenIds ?? [];
}

async function saveHiddenIds(ids: string[]): Promise<void> {
  await setDoc(HIDDEN_PRODUCTS_REF, { hiddenIds: ids });
}

export async function hideProduct(id: string): Promise<void> {
  const current = await getHiddenProductIds();
  if (current.includes(id)) return;
  await saveHiddenIds([...current, id]);
}

export async function restoreProduct(id: string): Promise<void> {
  const current = await getHiddenProductIds();
  await saveHiddenIds(current.filter((h) => h !== id));
}

export function useHiddenProductIds() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await getHiddenProductIds();
      setHiddenIds(ids);
    } catch {
      setHiddenIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { hiddenIds, loading, refetch };
}
