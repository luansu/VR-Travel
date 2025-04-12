import React from 'react'

export const NavBar = () => {
  return (
    <nav className='flex justify-between items-center mx-10 my-10 px-8 w-full text-white'>
      <div className='text-5xl font-medium cursor-pointer'>Logo</div>
      <ul className='flex items-center gap-12'>
        <li>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Home</a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Restruction</a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">Library</a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400 transition-colors duration-300">History</a>
        </li>
      </ul>
    </nav>
  );
};
