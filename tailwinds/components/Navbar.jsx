import React from 'react';
import Link from 'next/link';

const Navbar = (props) => {
  const { toggle } = props;
  return (
    <>
      <nav className='flex justify-between items-center h-16 bg-white text-block relative shadow-sm font-mono' role="navigation">
          <Link href="/">
              <a className="pl-8">UCSBDebates</a>
          </Link>
          <div className='px-4 cursor-pointer md:hidden' onClick={toggle}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </div>
          <div className="pr-8 md:block hidden">
            <Link href='/'><a className="p-4">Home</a></Link>
            <Link href='/debates'><a className="p-4">Debates</a></Link>
            <Link href='/about'><a className="p-4">About</a></Link>
            <Link href='/contact'><a className="p-4">Contact</a></Link>
          </div>
      </nav>
    </>
  );
};

export default Navbar;
