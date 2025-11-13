import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-2 items-center h-16">
          <Link to={'/'} className='h-full'>
            <img src='carbon-removers.png' className='h-full cursor-pointer'/>
          </Link>

          {/* Nav links */}
          <div className="flex space-x-6 font-benzin-bold items-center">
            <Link to="/" className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white cursor-pointer">
              Tracker
            </Link>

            {/* Add Dropdown on hover */}
            <div className="relative group">
              <button className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white cursor-pointer">
                Add ▼
              </button>
              <div className="absolute top-full left-0 bg-white border border-gray-300 rounded shadow-md flex flex-col opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity z-10">
                <Link to="/clients" className="p-2 hover:bg-gray-100 text-left cursor-pointer">
                  Client
                </Link>
                <Link to="/drivers" className="p-2 hover:bg-gray-100 text-left cursor-pointer">
                  Driver
                </Link>
                <Link to="/trucks" className="p-2 hover:bg-gray-100 text-left cursor-pointer">
                  Truck
                </Link>
                <Link to="/routes" className="p-2 hover:bg-gray-100 text-left cursor-pointer">
                  Route
                </Link>
              </div>
            </div>

            {/* <Link to="/login" className="hover:text-black ease-in-out duration-300 bg-carbonOrange py-2 px-3 text-white cursor-pointer">
              Logout
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
