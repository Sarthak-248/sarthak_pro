import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function FavoriteListings() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);

      try {
        const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favoriteIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const listings = [];

        for (const id of favoriteIds) {
          try {
            const res = await axios.get(`/api/listing/get/${id}`);
            listings.push(res.data);
          } catch (err) {
            console.error(`❌ Failed to fetch listing ${id}:`, err.message);
          }
        }

        setFavorites(listings);
      } catch (err) {
        console.error('❌ Error fetching favorites:', err);
        setError('Failed to load favorite listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading)
    return (
      <p className="text-center text-white p-8 bg-gradient-to-b from-blue-900 via-black to-blue-900 min-h-screen">
        Loading favorites...
      </p>
    );
  if (error)
    return (
      <p className="text-red-600 text-center bg-gradient-to-b from-blue-900 via-black to-blue-900 min-h-screen p-8">
        {error}
      </p>
    );

  return (
    <div className="p-4 bg-gradient-to-b from-blue-900 via-black to-blue-900 min-h-screen">
      <h2 className="text-4xl mt-6 text-center text-yellow-400 font-bold mb-10">
        ★ Favourite Listings ★
      </h2>

      {favorites.length === 0 ? (
        <div className="p-6 mt-10 text-center">
          <p className="text-xl text-yellow-300 font-semibold">
            No favorite listings found.
          </p>
        </div>
      ) : (
        <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((listing) => (
            <Link to={`/listing/${listing._id}`} key={listing._id}>
              <div className="bg-white rounded-xl p-4 transition-transform transform hover:scale-105 shadow-lg border-4 border-transparent hover:border-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:border-opacity-100 hover:shadow-yellow-500/30">
                <h3 className="font-bold text-lg mb-2 text-blue-900">
                  {listing.name}
                </h3>
                <img
                  src={listing.imageUrls?.[0]}
                  alt="Listing"
                  className="w-full h-48 object-cover rounded-md mb-3 border border-yellow-300"
                />
                <p className="text-gray-600 mb-1">{listing.address}</p>
                <p className="text-sm text-slate-500">
                  ${listing.offer ? listing.discountPrice : listing.regularPrice}
                  {listing.type === 'rent' && ' / month'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
