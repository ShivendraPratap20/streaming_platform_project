import { createBrowserRouter } from 'react-router';
import Home from '../pages/Home';
import VideoPlayerPage from '../pages/VideoPlayer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: "/player/:id",
    element: <VideoPlayerPage />,
    loader: async ({ params }) => {
      return params.id;
    }
  }
]);

export default router;