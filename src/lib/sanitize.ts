import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving safe formatting
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // Configure DOMPurify with secure settings
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'article', 'section', 'main', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id', 'rel', 'target'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Remove dangerous tags and attributes
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'iframe', 'frame', 'frameset'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'style'],
    // Keep content when removing tags
    KEEP_CONTENT: true,
    // Prevent DOM clobbering
    SANITIZE_DOM: true,
    // Disable data attributes for security
    ALLOW_DATA_ATTR: false
  });

  // Add security attributes to external links
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = clean;
  
  const links = tempDiv.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      // More robust external link detection
      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname !== window.location.hostname) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      } catch {
        // If URL parsing fails, treat as external for safety
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      }
    }
  });

  return tempDiv.innerHTML;
};

/**
 * Creates a sanitized HTML object that can be safely used with dangerouslySetInnerHTML
 */
export const createSafeHTML = (html: string): { __html: string } => {
  return { __html: sanitizeHTML(html) };
};
