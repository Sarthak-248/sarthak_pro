import React, { useEffect, useState } from 'react';
import ListingItem from './ListingItem';

const RecentlyVisited = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

    const fetchListings = async () => {
      try {
        if (ids.length === 0) return;

        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await fetch(`/api/listing/get/${id}`);
              if (!res.ok) throw new Error(`Listing ${id} not found`);
              return await res.json();
            } catch (err) {
              console.warn(`Skipping invalid listing ID: ${id}`);
              return null; // Skip if not found
            }
          })
        );

        // Filter out null results (i.e., failed fetches)
        const validListings = results.filter((listing) => listing !== null);
        setRecentListings(validListings.reverse()); // Latest first
      } catch (err) {
        console.error('Error loading listings:', err);
        setError('Failed to load recently viewed listings.');
      }
    };

    if (ids.length > 0) fetchListings();
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-100 rounded-lg shadow-lg mt-10 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (recentListings.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-950 via-blue-900 to-black text-white">
        <p className="text-2xl font-semibold">No recently viewed properties found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-yellow-400 drop-shadow-md tracking-wide">
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
