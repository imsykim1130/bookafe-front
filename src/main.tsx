import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import User from './pages/User.tsx';
import { Provider } from 'react-redux';
import Search from './pages/Search.tsx';

import OrderSuccess from './pages/OrderSuccess.tsx';
import Point from './pages/Point.tsx';
import OrderStatus from './pages/admin/OrderStatus.tsx';
import RecommendBook from './pages/admin/RecommendBook.tsx';
import UserManagement from './pages/admin/UserManagement.tsx';

import { store } from './redux';
import BookDetail from './pages/common/BookDetail';
import Landing from './pages/common/Landing/Landing.tsx';
import OrderDetailPage from './pages/common/OrderDetailPage/OrderDetailPage.tsx';
import Cart from './pages/common/Cart/index.tsx';
import Favorite from './pages/common/Favorite/Favorite.tsx';
import Auth from './pages/common/Auth/Auth.tsx';
import ErrorPage from './pages/common/ErrorPage/ErrorPage.tsx';

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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
