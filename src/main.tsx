import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import './index.css';

import App from './App.tsx';
import Search from './pages/Search.tsx';
import User from './pages/User.tsx';

import OrderStatus from './pages/admin/OrderStatus.tsx';
import RecommendBook from './pages/admin/RecommendBook.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';

import Cart from '@/pages/common/Cart/Cart.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';
import Book from './pages/Book.tsx';
import Auth from './pages/Auth.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Favorite from './pages/Favorite.tsx';
import Landing from './pages/common/Landing/Landing.tsx';
import OrderDetailPage from './pages/common/OrderDetailPage/OrderDetailPage.tsx';
import Test from './temp/gsap.test.tsx';

const queryClient = new QueryClient({});

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
        path: '/user',
        element: <User />,
      },
      {
        path: '/favorite',
        element: <Favorite />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/book/detail/:isbn',
        element: <Book />,
      },
      {
        path: '/order/detail',
        element: <OrderDetailPage />,
      },
      {
        path: '/admin/order-status',
        element: <OrderStatus />,
      },
      {
        path: '/admin/recommend-book',
        element: <RecommendBook />,
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
        path: "/test",
        element: <Test/>
      }
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
