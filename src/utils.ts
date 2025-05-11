export function querySelectorOrDie<T>(
  elemType: { new (): T },
  root: HTMLElement,
  query: string,
): T {
  const found = root.querySelector(query);
  if (found instanceof elemType) return found;
  console.error("Could not find", elemType, query, root);
  throw new Error(`Could not find child`);
}
