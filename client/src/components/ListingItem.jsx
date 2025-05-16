import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function ListingItem({ listing, onCompareSelect, selectedList }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const isChecked = selectedList?.some((p) => p._id === listing._id);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(listing._id)) {
      setIsFavorite(true);
    }
  }, [listing._id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter(id => id !== listing._id);
    } else {
      updatedFavorites = [...favorites, listing._id];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    // Notify other tabs/components
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div className='relative bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] h-[420px] flex flex-col justify-between'>
      <Link
        to={`/listing/${listing._id}`}
        className="block flex-grow"
        onClick={() => {
          const visited = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
          const updated = [listing, ...visited.filter(item => item._id !== listing._id)];
          localStorage.setItem('recentlyViewed', JSON.stringify(updated.slice(0, 5)));
        }}
      >
        <img
          src={listing.imageUrls?.[0] || 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'}
          alt={listing.name || 'listing cover'}
          className='h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full flex-grow'>
          <p className='truncate text-lg font-semibold text-slate-700'>{listing.name || 'Unnamed Listing'}</p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>{listing.address || 'No address provided'}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2 flex-grow'>{listing.description || 'No description available'}</p>
          <p className='text-slate-500 mt-2 font-semibold'>
            ${listing.offer ? listing.discountPrice?.toLocaleString('en-US') : listing.regularPrice?.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>

      <div
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 cursor-pointer text-xl p-2 rounded-full z-10 transition-all duration-300 ease-in-out ${
          isFavorite
            ? 'text-red-500 bg-white shadow-lg scale-110'
            : 'text-gray-300 bg-white hover:text-red-400 hover:scale-110 shadow'
        }`}
        aria-label="Toggle Favorite"
      >
        <FaHeart />
      </div>

      {onCompareSelect && selectedList && (
        <div className="absolute bottom-2 right-2 z-10">
          <label
            title="Compare this property"
            className="bg-blue-950 text-blue-400 p-1 rounded-full shadow-md cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onCompareSelect(listing)}
              className="w-5 h-5 accent-blue-400 cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
