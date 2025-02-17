import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import './index.css';

import App from './App.tsx';
import Search from './pages/Search.tsx';
import User from './pages/User.tsx';

import OrderSuccess from './pages/OrderSuccess.tsx';
import Point from './pages/Point.tsx';
import OrderStatus from './pages/admin/OrderStatus.tsx';
import RecommendBook from './pages/admin/RecommendBook.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';

import { CookiesProvider } from 'react-cookie';
import Auth from './pages/common/Auth/Auth.tsx';
import BookDetail from './pages/common/BookDetail';
import ErrorPage from './pages/common/ErrorPage/ErrorPage.tsx';
import Favorite from './pages/common/Favorite/Favorite.tsx';
import Landing from './pages/common/Landing/Landing.tsx';
import OrderDetailPage from './pages/common/OrderDetailPage/OrderDetailPage.tsx';
import Cart from '@/pages/common/Cart/Cart.tsx';

const queryClient = new QueryClient();

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
        element: <BookDetail />,
      },
      {
        path: '/order/success',
        element: <OrderSuccess />,
      },
      {
        path: '/order/detail',
        element: <OrderDetailPage />,
      },
      {
        path: '/point',
        element: <Point />,
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
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
  </QueryClientProvider>,
);
