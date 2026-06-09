import { Suspense, lazy } from 'react';

const AdminEditorPage = lazy(() => import('./AdminEditorPage').then(module => ({ default: module.AdminEditorPage })));

export const AdminEditorRoute = () => (
  <Suspense
    fallback={(
      <section className="admin-page">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Loading editor</h1>
            <p>Preparing Puck editor for this page.</p>
          </div>
        </div>
      </section>
    )}
  >
    <AdminEditorPage />
  </Suspense>
);
