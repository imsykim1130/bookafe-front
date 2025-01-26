import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes('/auth/');

  return !isAuthPage ? (
    <footer className="flex justify-center items-center h-[50px] bg-light-gray">
      <p className="text-sm text-light-black">© 2025 Bookafe. All rights reserved.</p>
    </footer>
  ) : '';
};

export default Footer;
