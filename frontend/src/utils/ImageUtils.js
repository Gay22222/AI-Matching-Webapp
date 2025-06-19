export const normalizePhotoUrl = (url) => {
  if (!url) {
    console.warn("Photo URL is empty, using default avatar");
    return "/default-avatar.jpg";
  }
  if (url.startsWith("http")) {
    return url;
  }
  let cleanUrl = url.replace(/^\/*uploads\/*/i, "");
  cleanUrl = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  const finalUrl = `${process.env.NEXT_PUBLIC_UPLOADS_URL}${cleanUrl.toLowerCase()}`;
  console.debug(`Normalized photo URL: ${finalUrl}`);
  return finalUrl;
};

export const handleImageError = (e, defaultSrc = "/default-avatar.jpg") => {
  console.error(`Failed to load image: ${e.target.src}, error: ${e.type}, status: ${e.target.status || "unknown"}`);
  e.target.src = defaultSrc;
};
