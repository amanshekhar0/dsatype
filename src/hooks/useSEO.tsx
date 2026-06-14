import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description?: string;
  /** Path relative to origin, e.g. "/practice". Defaults to current path. */
  canonicalPath?: string;
}

const SITE_NAME = 'CodeType';
const BASE_URL = 'https://codetype.app';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Lightweight, dependency-free per-route SEO.
 * Updates document title, meta description, canonical, and OG/Twitter tags.
 */
export function useSEO({ title, description, canonicalPath }: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const path = canonicalPath ?? window.location.pathname;
    const url = `${BASE_URL}${path}`;
    setCanonical(url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }
  }, [title, description, canonicalPath]);
}
