export function getImageUrl(key: string | null | undefined): string {
  if (!key) return '';
  return `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${key}`;
}
