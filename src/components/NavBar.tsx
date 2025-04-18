import { useLocation, useNavigate, Link } from 'react-router-dom';

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className='flex justify-between items-center px-8 py-10 w-full text-white'>
      <div className='text-5xl font-medium cursor-pointer'>Logo</div>
      <ul className='flex items-center gap-20 mr-10'>
        <li>
          <Link to="/">
            <a className="hover:text-blue-400 transition-colors duration-300">Home</a>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <a className="hover:text-blue-400 transition-colors duration-300">Restruction</a>
            </Link>
        </li>
        <li>
          <Link to="/library">
            <a className="hover:text-blue-400 transition-colors duration-300">Library</a>
            </Link>
        </li>
        <li>
          <Link to="/res">
            <a className="hover:text-blue-400 transition-colors duration-300">History</a>
            </Link>
        </li>
      </ul>
    </nav>
  )
}
