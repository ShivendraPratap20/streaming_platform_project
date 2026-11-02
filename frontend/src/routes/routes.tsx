import { createBrowserRouter, } from 'react-router';
import MainLayout from './MainLayout';
import Home from '../pages/Home';
import VideoPlayerPage from '../pages/VideoPlayer';
import { MoviesTab, MusicTab, UploadsTab, FavoritesTab } from '../components/PageComponent/HomePageComp';
import api from '../api/axios';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/movies",
        element: <MoviesTab />,
      },
      {
        path: "/music",
        element: <MusicTab />,
      },
      {
        path: "/uploads",
        element: <UploadsTab />,
      },
      {
        path: "/favorites",
        middleware: [({ request, context }, next) => {
          
          const response =  api.get('/user/auth/self');
          console.log("Favorites route auth/self response", response);
        }],
        element: <FavoritesTab />,
      },
      {
        path: "/player/:id",
        element: <VideoPlayerPage />,
      },
    ]
  },
]);

export default router;