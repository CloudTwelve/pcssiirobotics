import { createContext, useContext, useMemo, useState } from 'react';
import { loadContent, resetContent, saveContent } from './contentStore';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => loadContent());

  const value = useMemo(() => ({
    content,
    save: nextContent => {
      const savedContent = saveContent(nextContent);
      setContent(savedContent);
      return savedContent;
    },
    reset: () => {
      const defaultContent = resetContent();
      setContent(defaultContent);
      return defaultContent;
    }
  }), [content]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const value = useContext(ContentContext);

  if (!value) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  return value;
};