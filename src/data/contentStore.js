import defaultContent from '../content/siteContent.json';
import { normalizeContent } from './contentModel';

const STORAGE_KEY = 'pcss-robotics-content-v1';

export const getDefaultContent = () => normalizeContent(structuredClone(defaultContent), defaultContent);

export const loadContent = () => {
  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return getDefaultContent();
  }

  try {
    return normalizeContent(JSON.parse(saved), defaultContent);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return getDefaultContent();
  }
};

export const saveContent = content => {
  const normalizedContent = normalizeContent(content, defaultContent);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedContent, null, 2));
  return normalizedContent;
};

export const resetContent = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  return getDefaultContent();
};

export const downloadJson = content => {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pcss-robotics-content.json';
  link.click();
  URL.revokeObjectURL(url);
};
