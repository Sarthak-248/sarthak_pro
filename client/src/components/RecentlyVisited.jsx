import React, { useEffect, useState } from 'react';
import ListingItem from './ListingItem';

const RecentlyVisited = () => {
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    try {
      const storedListings = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      // Reverse to show most recent first
      setRecentListings([...storedListings].reverse());
    } catch (error) {
      console.error('Error reading recently viewed listings from localStorage:', error);
      setRecentListings([]);
    }
  }, []);

  if (recentListings.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-950 via-blue-900 to-black text-white px-4">
        <p className="text-2xl font-semibold text-center">
          No recently viewed properties found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-yellow-400 drop-shadow-md tracking-wide">
        ✨ Recently Viewed ✨
      </h2>

      <div className="flex overflow-x-auto space-x-6 py-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent">
        {recentListings.map((listing) => (
          <div
            key={listing._id}
            className="min-w-[320px] transform transition duration-300 hover:scale-105 hover:shadow-[0_0_25px_#facc15] bg-gradient-to-tr from-yellow-200/10 via-white/5 to-yellow-200/10 rounded-xl p-1"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <ListingItem listing={listing} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyVisited;
