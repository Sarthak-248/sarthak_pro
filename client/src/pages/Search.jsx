import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Compare from '../components/Compare';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedListings, setSelectedListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      console.log(res);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sale'].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) =>
      urlParams.set(key, value)
    );
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data]);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
  };

  const handleListingSelect = (listing) => {
    setSelectedListings((prevSelectedListings) => {
      const alreadySelected = prevSelectedListings.find(
        (item) => item._id === listing._id
      );
      if (alreadySelected) {
        return prevSelectedListings.filter((item) => item._id !== listing._id);
      } else if (prevSelectedListings.length < 3) {
        return [...prevSelectedListings, listing];
      } else {
        alert('You can only compare up to 3 properties.');
        return prevSelectedListings;
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-950 via-black to-blue-900 min-h-screen text-yellow-200">
      {/* Sidebar */}
      <div
        className="p-7 border-b md:border-r border-transparent md:min-h-screen bg-black/20 backdrop-blur"
        style={{
          borderImage: 'linear-gradient(to bottom, #0000ff, #ffcc00) 1',
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="bg-transparent border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full placeholder-yellow-400"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-3">
            <label className="font-semibold">Type:</label>
            {['all', 'rent', 'sale', 'offer'].map((type) => (
              <label key={type} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id={type}
                  className="w-5 accent-yellow-500"
                  onChange={handleChange}
                  checked={type === 'offer' ? sidebardata.offer : sidebardata.type === type}
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Amenities Filters */}
          <div className="flex flex-wrap gap-3">
            <label className="font-semibold">Amenities:</label>
            {['parking', 'furnished'].map((amenity) => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id={amenity}
                  className="w-5 accent-yellow-500"
                  onChange={handleChange}
                  checked={sidebardata[amenity]}
                />
                <span className="capitalize">{amenity}</span>
              </label>
            ))}
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue="created_at_desc"
              id="sort_order"
              className="bg-transparent border border-yellow-500 text-yellow-200 rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-yellow-500 text-black font-bold p-3 rounded-lg uppercase hover:brightness-110 transition">
            Search
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={toggleCompareMode}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
          >
            {compareMode ? 'Cancel Compare' : 'Compare Properties'}
          </button>
        </div>
      </div>

      {/* Listings Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold border-b border-yellow-600 p-4">
          Listing Results
        </h1>

        {compareMode ? (
          <Compare selected={selectedListings} />
        ) : (
          <div className="p-7 flex flex-wrap gap-6">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-yellow-400">No listings found.</p>
            )}
            {loading && (
              <p className="text-xl text-yellow-400 text-center w-full">
                Loading...
              </p>
            )}
            {!loading &&
              listings.map((listing) => (
                <ListingItem
                  key={listing._id}
                  listing={listing}
                  onCompareSelect={handleListingSelect}
                  selectedList={selectedListings}
                />
              ))}
          </div>
        )}

        {showMore && !compareMode && (
          <div className="flex justify-center p-4">
            <button
              onClick={onShowMoreClick}
              className="text-yellow-300 hover:text-yellow-100 underline"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
