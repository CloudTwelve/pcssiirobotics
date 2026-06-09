import { Suspense, lazy } from 'react';

const AdminPage = lazy(() => import('./AdminPage').then(module => ({ default: module.AdminPage })));

export const AdminPageRoute = () => (
  <Suspense
    fallback={(
      <section className="admin-page">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Loading content</h1>
            <p>Preparing editable content model.</p>
          </div>
        </div>
      </section>
    )}
  >
    <AdminPage />
  </Suspense>
);