import { createBrowserRouter, } from 'react-router';
import MainLayout from './MainLayout';
import Home from '../pages/Home';
import VideoPlayerPage from '../pages/VideoPlayer';
import { MoviesTab, MusicTab, UploadsTab, FavoritesTab } from '../components/PageComponent/HomePageComp';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../pages/Profile';
import ArtistProfile from '../pages/ArtistProfile';

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
        element: <ProtectedRoute />,
        children: [
          {
            path: "/favorites",
            element: <FavoritesTab />,
          },
        ]
      },
      {
        path: "/player/:id",
        element: <VideoPlayerPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage/>
      },
      {
        path:"/artist/:artistName",
        element:<ArtistProfile/>
      }
    ]
  },
]);

export default router;