
/**
 * Preview Service for Info Stream Africa
 * Handles preview functionality for draft content
 */

// The secret that is used to enable preview mode - in production this should be an environment variable
const PREVIEW_SECRET = "infostream_preview_secret";

/**
 * Validates a preview request
 * @param {string} secret - The provided secret token
 * @param {string} slug - The slug of the article to preview
 * @returns {boolean} - Whether the preview request is valid
 */
export const validatePreviewRequest = (secret, slug) => {
  if (!secret || !slug) {
    return false;
  }
  
  return secret === PREVIEW_SECRET;
};

/**
 * Generates a preview URL for a specific article
 * @param {Object} article - The article data
 * @returns {string} - The preview URL
 */
export const generatePreviewUrl = (article) => {
  if (!article || !article.slug) {
    return null;
  }
  
  // Create preview URL with necessary parameters
  const baseUrl = window.location.origin;
  return `${baseUrl}/preview?slug=${article.slug}&secret=${PREVIEW_SECRET}&draft=true`;
};

/**
 * Checks if draft mode is currently enabled
 * @returns {boolean} - Whether draft mode is enabled
 */
export const isDraftModeEnabled = () => {
  return sessionStorage.getItem('previewMode') === 'enabled';
};

/**
 * Gets the article ID being previewed
 * @returns {string|null} - The article ID or null if not in preview mode
 */
export const getPreviewArticleId = () => {
  return isDraftModeEnabled() 
    ? sessionStorage.getItem('previewArticleId') 
    : null;
};

/**
 * Exits preview mode by clearing session storage
 */
export const exitPreviewMode = () => {
  sessionStorage.removeItem('previewMode');
  sessionStorage.removeItem('previewArticleId');
};
