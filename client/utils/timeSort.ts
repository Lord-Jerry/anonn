export function timeSort(
  a: { updatedAt: string | number | Date },
  b: { updatedAt: string | number | Date }
) {
  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
}
