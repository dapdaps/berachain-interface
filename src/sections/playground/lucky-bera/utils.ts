export function hasDuplicate(arr: number[], options?: { exclude?: number[] }) {
  const { exclude } = options || {};
  const count: Record<number, number> = {};
  for (const num of arr) {
    count[num] = (count[num] || 0) + 1;
  }

  for (const num in count) {
    if (count[num] >= 2 && !exclude?.includes(Number(num))) {
      return true;
    }
  }
  return false;
}
