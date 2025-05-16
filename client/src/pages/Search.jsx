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
    bedrooms: 'any',
    bathrooms: 'any',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedListings, setSelectedListings] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 4;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    const bedroomsFromUrl = urlParams.get('bedrooms');
    const bathroomsFromUrl = urlParams.get('bathrooms');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      bedroomsFromUrl ||
      bathroomsFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
        bedrooms: bedroomsFromUrl || 'any',
        bathrooms: bathroomsFromUrl || 'any',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'type' || id === 'searchTerm' || id === 'bedrooms' || id === 'bathrooms') {
      setSidebardata({ ...sidebardata, [id]: value });
    }

    if (id === 'amenities') {
      const selected = value.split(',');
      setSidebardata({
        ...sidebardata,
        parking: selected.includes('parking'),
        furnished: selected.includes('furnished'),
      });
    }

    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handleRemoveListing = (id) => {
  setSelectedListings((prev) => prev.filter((listing) => listing._id !== id));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    Object.entries(sidebardata).forEach(([key, value]) =>
      urlParams.set(key, value)
    );
    navigate(`/search?${urlParams.toString()}`);
    setCurrentPage(1); // Reset to first page
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
  };

  const handleListingSelect = (listing) => {
    setSelectedListings((prev) => {
      const exists = prev.find((item) => item._id === listing._id);
      if (exists) return prev.filter((item) => item._id !== listing._id);
      if (prev.length >= 3) {
        alert('You can only compare up to 3 properties.');
        return prev;
      }
      return [...prev, listing];
    });
  };

  // Pagination logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <label className="font-semibold">Search:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="bg-transparent border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full placeholder-yellow-400"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Type:</label>
            <select
              id="type"
              value={sidebardata.type}
              onChange={handleChange}
              className="bg-[#1f1f1f] border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full"
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Amenities:</label>
            <select
              id="amenities"
              value={[
                sidebardata.parking ? 'parking' : '',
                sidebardata.furnished ? 'furnished' : '',
              ]
                .filter(Boolean)
                .join(',')}
              onChange={handleChange}
              className="bg-[#1f1f1f] border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full"
            >
              <option value="">None</option>
              <option value="parking">Parking</option>
              <option value="furnished">Furnished</option>
              <option value="parking,furnished">Parking + Furnished</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Bedrooms:</label>
            <select
              id="bedrooms"
              value={sidebardata.bedrooms}
              onChange={handleChange}
              className="bg-[#1f1f1f] border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Bathrooms:</label>
            <select
              id="bathrooms"
              value={sidebardata.bathrooms}
              onChange={handleChange}
              className="bg-[#1f1f1f] border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Sort by:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              className="bg-[#1f1f1f] border border-yellow-500 text-yellow-200 rounded-lg p-3 w-full"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-yellow-500 text-black font-bold p-3 rounded-lg uppercase hover:brightness-110 transition">
            Search
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={toggleCompareMode}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-full shadow-lg transition mt-3 duration-300"
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
<Compare selected={selectedListings} onRemove={handleRemoveListing} />
        ) : (
          <div className="p-7 flex flex-wrap gap-6 justify-center">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-yellow-400">No listings found.</p>
            )}
            {loading && (
              <p className="text-xl text-yellow-400 text-center w-full">
                Loading...
              </p>
            )}
            {!loading &&
              currentListings.map((listing) => (
                <ListingItem
                  key={listing._id}
                  listing={listing}
                  onCompareSelect={handleListingSelect}
                  selectedList={selectedListings}
                />
              ))}
          </div>
        )}

        {/* Pagination */}
        {!compareMode && totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6 mb-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-full font-semibold ${
                  page === currentPage
                    ? 'bg-yellow-400 text-black shadow-lg'
                    : 'bg-yellow-200 text-black hover:bg-yellow-300'
                } transition duration-200`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
