import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AvatarMenu } from './AvatarMenu';

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className='flex justify-between items-center px-20 py-10 w-full text-white'>
      <img
        src="/public/logo-cntt2021.png"
        alt="Logo CNTT 2021"
        className="w-20 h-20 cursor-pointer"
      />
      <ul className='flex items-center gap-20 mr-10'>
        <li>
          <Link to="/">
            <a className="hover:text-blue-400 transition-colors duration-300">Home</a>
          </Link>
        </li>
        <li>
          <Link to="/res">
            <a className="hover:text-blue-400 transition-colors duration-300">Restruction</a>
          </Link>
        </li>
        <li>
          <Link to="/library">
            <a className="hover:text-blue-400 transition-colors duration-300">Library</a>
          </Link>
        </li>
        <li>
          <Link to="/history">
            <a className="hover:text-blue-400 transition-colors duration-300">History</a>
          </Link>
        </li>
        <AvatarMenu />
      </ul>
    </nav>
  )
}
