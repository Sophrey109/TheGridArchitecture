import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving safe formatting
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // Configure DOMPurify to allow common formatting tags while removing dangerous elements
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id', 'style', 'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Remove script tags and on* event handlers
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    // Keep relative URLs but ensure they're safe
    KEEP_CONTENT: false,
    // Prevent DOM clobbering
    SANITIZE_DOM: true,
    // Allow data URIs for images (base64)
    ALLOW_DATA_ATTR: false
  });
  
  return clean;
};

/**
 * Creates a sanitized HTML object that can be safely used with dangerouslySetInnerHTML
 */
export const createSafeHTML = (html: string): { __html: string } => {
  return { __html: sanitizeHTML(html) };
};
