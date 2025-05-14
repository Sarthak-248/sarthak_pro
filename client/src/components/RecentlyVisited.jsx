import React, { useEffect, useState } from 'react';
import ListingItem from './ListingItem';

const RecentlyVisited = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    const fetchListings = async () => {
      try {
        if (ids.length === 0) {
          console.log('No recently viewed listings.');
          return; // No IDs in localStorage, so no need to fetch
        }
        
        console.log('Fetching listings with IDs:', ids);
        const results = await Promise.all(
          ids.map(async (id) => {
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${id}`);
            console.log(`Response for listing ${id}:`, res);
            if (!res.ok) {
              throw new Error(`Failed to fetch listing ${id}`);
            }
            return await res.json();
          })
        );
        setRecentListings(results);
      } catch (err) {
        console.error('Error loading recently visited listings:', err);
        setError('Failed to load recently visited listings. Please try again later.');
      }
    };

    if (ids.length > 0) fetchListings();
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md mt-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (recentListings.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md mt-10 text-center">
        No recently viewed properties found.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">
        Recently Viewed Properties
      </h2>
      <div className="flex flex-wrap gap-4">
        {recentListings.map((listing) => (
          <ListingItem key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyVisited;
