import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

const DEFAULT_TITLE = 'Outpost - T-Hub Founders Platform';
const DEFAULT_DESCRIPTION = 'Discover grants, challenges, and mentors. Your one-stop platform for startup resources at T-Hub.';
const DEFAULT_OG_IMAGE = '/og-image.png'; // TODO: Add actual OG image

/**
 * SEO component to set page metadata
 * Usage: <SEO title="Grants" description="Browse funding opportunities" />
 */
export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
}: SEOProps) {
  const fullTitle = title ? `${title} | Outpost - T-Hub` : DEFAULT_TITLE;
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;
  const finalOgUrl = ogUrl || window.location.href;

  useEffect(() => {
    // Update page title
    document.title = fullTitle;

    // Update meta description
    updateMetaTag('name', 'description', description);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', finalOgTitle);
    updateMetaTag('property', 'og:description', finalOgDescription);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', finalOgUrl);
    updateMetaTag('property', 'og:type', 'website');

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', finalOgTitle);
    updateMetaTag('name', 'twitter:description', finalOgDescription);
    updateMetaTag('name', 'twitter:image', ogImage);
  }, [fullTitle, description, finalOgTitle, finalOgDescription, ogImage, finalOgUrl]);

  return null;
}

function updateMetaTag(attribute: string, key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  
  element.content = content;
}
