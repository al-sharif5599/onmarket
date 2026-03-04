export const inferVideoMimeType = (url) => {
  if (!url) return undefined;
  const clean = url.split('?')[0].toLowerCase();

  if (clean.endsWith('.mp4') || clean.endsWith('.m4v')) return 'video/mp4';
  if (clean.endsWith('.webm')) return 'video/webm';
  if (clean.endsWith('.ogg') || clean.endsWith('.ogv')) return 'video/ogg';
  if (clean.endsWith('.mov')) return 'video/quicktime';
  if (clean.endsWith('.mkv')) return 'video/x-matroska';
  if (clean.endsWith('.avi')) return 'video/x-msvideo';
  if (clean.endsWith('.wmv')) return 'video/x-ms-wmv';
  if (clean.endsWith('.flv')) return 'video/x-flv';
  if (clean.endsWith('.3gp')) return 'video/3gpp';

  return undefined;
};
