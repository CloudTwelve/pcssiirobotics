import { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { downloadJson } from '../data/contentStore';
import { useContent } from '../data/ContentContext';
import { Icon } from '../components/Icon';
import { getEditablePages } from './puckAdapter';

export const AdminPage = () => {
  const { content, reset } = useContent();
  const pages = useMemo(() => getEditablePages(content), [content]);

  if (!content) {
    return (
      <section className="admin-page">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Loading content</h1>
            <p>Preparing editable content model.</p>
          </div>
        </div>
      </section>
    );
  }

  const handleReset = () => {
    reset();
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Page editor</h1>
          <p>All website pages are available in the Puck editor. Choose a page to edit, or open the live route in a new tab.</p>
        </div>
        <div className="admin-actions">
          <button className="button ghost dark" type="button" onClick={() => downloadJson(content)}><Icon name="file" />Export JSON</button>
          <button className="button ghost dark" type="button" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Pages</h2>
        <div className="page-editor-list page-admin-list">
          {pages.map(page => (
            <article key={page.slug} className="page-editor page-admin-card">
              <div>
                <strong>{page.title}</strong>
                <p className="page-admin-path">{page.viewPath}</p>
                {page.summary && <p className="page-admin-summary">{page.summary}</p>}
              </div>
              <div className="page-admin-actions">
                <a className="button ghost" href={page.viewPath} target="_blank" rel="noreferrer">View</a>
                <Link className="button ghost dark" to={page.editPath}>Edit in Puck</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
