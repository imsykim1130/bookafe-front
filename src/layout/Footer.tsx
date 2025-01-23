import { useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes('/auth/');

  return !isAuthPage ? <div>footer</div> : '';
};

export default Footer;
