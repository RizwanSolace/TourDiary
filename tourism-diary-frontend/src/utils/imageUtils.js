export const FALLBACK_DESTINATION_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80';

export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  try {
    const parsedUrl = new URL(imageUrl);
    const directImageUrl =
      parsedUrl.searchParams.get('mediaurl') ||
      parsedUrl.searchParams.get('imgurl') ||
      parsedUrl.searchParams.get('image_url');

    return directImageUrl || imageUrl;
  } catch {
    return imageUrl;
  }
};
