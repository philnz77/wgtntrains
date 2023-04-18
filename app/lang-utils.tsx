export function removeDuplicatesBy<T>(
  elements: T[],
  by: (element: T) => string
): T[] {
  const seen = new Set<string>();
  return elements.filter((element) => {
    const _by = by(element);

    if (seen.has(_by)) {
      return false;
    }
    seen.add(_by);

    return true;
  });
}
