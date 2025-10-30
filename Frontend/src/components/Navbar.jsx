import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-2 items-center h-16">
          <Link to={'/'} className='h-full'><img src='carbon-removers.png' className='h-full cursor-pointer'/></Link>

          {/* Nav links */}
          <div className="flex space-x-6 font-benzin-bold">
            <Link to="/" className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white">Tracker</Link>
            <Link to="/routes" className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white">Routes</Link>
            <Link to="/login" className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white">Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
