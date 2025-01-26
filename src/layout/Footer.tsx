import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes('/auth/');

  return !isAuthPage ? (
    <footer className="flex justify-center pt-20 pb-5 bg-light-gray">
      <p className="text-xs text-light-black">© 2025 Bookafe. All rights reserved.</p>
    </footer>
  ) : (
    ''
  );
};

export default Footer;
