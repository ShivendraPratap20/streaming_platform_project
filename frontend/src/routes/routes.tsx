import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import VideoPlayerPage from '../pages/VideoPlayer';
import MainLayout from './MainLayout';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/player/:id",
        element: <VideoPlayerPage />,
      },
    ]
  },
]);

export default router;