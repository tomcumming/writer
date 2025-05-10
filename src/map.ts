export function insertWith<K, V>(
  m: Map<K, V>,
  k: K,
  v: V,
  combine: (k: K, v1: V, V2: V) => V,
): Map<K, V> {
  return unionWith(m, new Map([[k, v]]), combine);
}

export function unionWith<K, V>(
  m1: Map<K, V>,
  m2: Map<K, V>,
  combine: (k: K, v1: V, V2: V) => V,
): Map<K, V> {
  const result = new Map(m1);
  for (const [k, v2] of m2) {
    if (m1.has(k)) {
      const v1: V = m1.get(k) as V;
      result.set(k, combine(k, v1, v2));
    } else {
      result.set(k, v2);
    }
  }
  return result;
}
