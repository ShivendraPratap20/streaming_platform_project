
import type React from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: "/player/:id",
    element: <VideoPlayer />,
    loader: async ({ params }) => {
      return params.id;
    }
  }
]);

function App(): React.JSX.Element {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
