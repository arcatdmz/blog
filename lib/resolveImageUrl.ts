export function resolveImageUrl(image: string, imageRoot: string) {
  return new URL(image, imageRoot).toString();
}
