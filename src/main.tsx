import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import './index.css';

import App from './App.tsx';
import Search from './pages/Search.tsx';
import User from './pages/User.tsx';

import RecommendBookPage from './pages/admin/RecommendBook.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import Auth from './pages/Auth.tsx';
import Book from './pages/Book.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Favorite from './pages/Favorite.tsx';
import Landing from './pages/Landing.tsx';
import Test from './temp/gsap.test.tsx';

export const queryClient = new QueryClient({});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: '/search/:searchWord',
        element: <Search />,
      },
      {
        path: '/auth/:authType',
        element: <Auth />,
      },
      {
        path: '/user/:userId',
        element: <User />,
      },
      {
        path: '/favorite',
        element: <Favorite />,
      },
      {
        path: '/book/detail/:isbn',
        element: <Book />,
      },
      {
        path: '/admin/recommend-book',
        element: <RecommendBookPage />,
      },
      {
        path: '/admin/user-management',
        element: <UserManagement />,
      },
      {
        path: '/error/:code',
        element: <ErrorPage />,
      },
      {
        path: '/test',
        element: <Test />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
    <ReactQueryDevtools />
  </QueryClientProvider>,
);
