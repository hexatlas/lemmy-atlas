import * as React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotFoundComponent from './components/shared/404';

import { routeTree } from './routeTree.gen';

//

export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <p>LOADING...</p>,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: ({ data }) => <NotFoundComponent data={data} />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <>
      <RouterProvider router={router} defaultPreload="intent" />
    </>
  );
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
