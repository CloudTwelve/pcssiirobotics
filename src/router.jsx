import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { GenericPage, HomePage, NotFoundPage } from './components/Pages';
import { AdminPageRoute } from './admin/AdminPageRoute';
import { AdminEditorRoute } from './admin/AdminEditorRoute';

const getContentRoutes = (rootRoute, content) => {
  const seenPaths = new Set(['/']);

  return content.pages
    .filter(page => page.slug)
    .filter(page => {
      const nextPath = `/${page.slug}`;

      if (seenPaths.has(nextPath)) {
        return false;
      }

      seenPaths.add(nextPath);
      return true;
    })
    .map(page => createRoute({
      getParentRoute: () => rootRoute,
      path: `/${page.slug}`,
      component: () => <GenericPage page={page} />
    }));
};

export const makeRouter = content => {
  const rootRoute = createRootRoute({
    component: () => <Layout content={content} />,
    notFoundComponent: () => <NotFoundPage content={content} />
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <HomePage content={content} />
  });

  const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPageRoute
  });

  const adminEditHomeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/edit',
    component: AdminEditorRoute
  });

  const adminEditPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/edit/$slug',
    component: AdminEditorRoute
  });

  const contentRoutes = getContentRoutes(rootRoute, content);

  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute, adminRoute, adminEditHomeRoute, adminEditPageRoute, ...contentRoutes]),
    defaultPreload: 'intent'
  });
};
