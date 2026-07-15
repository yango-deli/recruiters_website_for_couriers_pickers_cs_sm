/** Shared CV/resume upload constraints for the public lead forms. */

/** Value for the file input `accept` attribute. */
export const CV_ACCEPT_EXTENSIONS = ".pdf,.doc,.docx";

/** Allowed MIME types (kept in sync with the CRM `other` document slot). */
export const CV_ACCEPT_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Max upload size. Capped at 4 MB because the file traverses two serverless
 * hops (website API → CRM webhook), each bounded by the platform body limit.
 */
export const CV_MAX_BYTES = 4 * 1024 * 1024;

export type CvValidationError = "type" | "size";

/** Validate a selected CV file. Returns an error code, or null when valid. */
export function validateCvFile(file: File): CvValidationError | null {
  const extOk = /\.(pdf|doc|docx)$/i.test(file.name);
  // Some browsers send an empty type for .doc; fall back to the extension.
  const mimeOk = !file.type || CV_ACCEPT_MIME.includes(file.type);
  if (!extOk || !mimeOk) return "type";
  if (file.size > CV_MAX_BYTES) return "size";
  return null;
}
