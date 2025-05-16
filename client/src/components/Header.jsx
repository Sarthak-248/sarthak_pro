import { FaSearch, FaHeart, FaClock } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Logo from '../assets/images/Logo.png'; // ✅ Import the logo image

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [animateFav, setAnimateFav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const favoriteListings = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoriteCount = favoriteListings.length;

  useEffect(() => {
    setAnimateFav(true);
    const timeout = setTimeout(() => setAnimateFav(false), 300);
    return () => clearTimeout(timeout);
  }, [favoriteCount]);

  return (
    <header className="bg-gradient-to-r from-black via-blue-950 to-blue-950 text-yellow-300 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 sm:h-10 object-contain" />
          <h1 className="font-extrabold text-lg sm:text-2xl tracking-wide drop-shadow-lg">
            <span className="text-yellow-300">Sarthak </span>
            <span className="text-yellow-500">Heights</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-black/20 backdrop-blur-sm border border-yellow-400 rounded-full px-4 py-2 flex items-center shadow-lg"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-yellow-200 placeholder-yellow-300 focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-yellow-400 hover:text-yellow-300 transition" />
          </button>
        </form>

        {/* Navigation Items */}
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-yellow-300 hover:text-yellow-100 transition font-medium">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-yellow-300 hover:text-yellow-100 transition font-medium">
              About
            </li>
          </Link>

          {/* Recently Viewed Button */}
          <Link to="/recently-visited">
            <li className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-black rounded-full shadow hover:bg-yellow-400 transition font-semibold">
              <FaClock className="text-black" />
              <span className="hidden sm:inline">Recently Viewed</span>
            </li>
          </Link>

          {/* Favorites Button */}
          <Link to="/favorites">
            <li className="relative group transition">
              <div
                className={`flex items-center gap-1 font-medium transition-all duration-300 ${
                  animateFav ? 'scale-110' : 'scale-100'
                }`}
              >
                <FaHeart className="text-white text-xl transition-transform duration-300 group-hover:scale-125" />
                <span className="hidden sm:inline text-yellow-300 group-hover:text-yellow-100 transition">
                  Favorites
                </span>
              </div>
              {favoriteCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full px-2 py-0.5 text-xs font-bold shadow transition-transform duration-300 ${
                    animateFav ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {favoriteCount}
                </span>
              )}
            </li>
          </Link>

          {/* Profile / Sign In */}
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-yellow-500 shadow"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-yellow-300 hover:text-yellow-100 transition font-medium">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
