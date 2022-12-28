export function dateSort(a: { updatedAt: Date }, b: { updatedAt: Date }) {
  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
}
