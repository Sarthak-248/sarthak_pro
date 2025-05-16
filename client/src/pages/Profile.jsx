import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showOnlyListings, setShowOnlyListings] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          setFormData({
            avatar: data.user.avatar,
            username: data.user.username,
            email: data.user.email,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [currentUser._id]);

  useEffect(() => {
    if (file) uploadFile(file);
  }, [file]);

  const uploadFile = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'sar_mor');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dypvyjfgk/image/upload',
        formDataUpload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const imageUrl = response.data.secure_url;
      setFilePerc(100);

      const updateResponse = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: imageUrl }),
      });

      const updateData = await updateResponse.json();
      if (updateData.success === false) {
        dispatch(updateUserFailure(updateData.message));
        return;
      }

      dispatch(updateUserSuccess(updateData));
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    } catch (error) {
      console.error('Upload or update failed:', error);
      setFileUploadError(true);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data.listings || data);
      setShowOnlyListings(true);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-black to-blue-900 p-6 rounded-lg">
      {!showOnlyListings && (
        <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">Profile</h1>
      )}

      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="flex flex-col items-center">
        {!showOnlyListings && (
          <>
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <img
                onClick={() => fileRef.current?.click()}
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-yellow-500"
              />
              <p className="text-center text-yellow-400">
                {fileUploadError ? (
                  <span className="text-red-700">Error uploading image</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span>Uploading {filePerc}%</span>
                ) : filePerc === 100 ? (
                  <span>Image uploaded successfully!</span>
                ) : (
                  ''
                )}
              </p>
            </div>

            {/* User Inputs */}
            <div className="flex flex-col items-center w-full mt-6 gap-4 mb-6">
              <input
                type="text"
                placeholder="Username"
                defaultValue={formData.username || currentUser.username}
                id="username"
                className="border-2 border-yellow-500 p-3 text-lg rounded-lg bg-white w-1/2"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                id="email"
                defaultValue={formData.email || currentUser.email}
                className="border-2 border-yellow-500 p-3 text-lg rounded-lg bg-white w-1/2"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="border-2 border-yellow-500 p-3 text-lg rounded-lg bg-white w-1/2"
                onChange={handleChange}
              />
            </div>

            {/* Update Button */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-yellow-500 text-blue-900 rounded-lg p-2 text-sm uppercase hover:bg-yellow-400 disabled:opacity-70 font-bold mt-5 w-1/2"
            >
              {loading ? 'Loading...' : 'Update'}
            </button>

            {/* Listing Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleShowListings}
                className="bg-yellow-500 font-bold text-blue-900 p-2 text-sm rounded-lg hover:bg-yellow-400"
              >
                Show Listings
              </button>
              <Link
                to="/create-listing"
                className="bg-yellow-500 font-bold text-blue-900 p-2 text-sm rounded-lg hover:bg-yellow-400"
              >
                Create Listing
              </Link>
            </div>

            {/* Delete / Sign Out */}
            <div className="flex justify-center gap-96 mt-6">
              <span
                onClick={handleDeleteUser}
                className="bg-red-600 font-bold text-white p-2 text-sm rounded-lg cursor-pointer hover:bg-red-500 transition-all"
              >
                Delete Account
              </span>
              <span
                onClick={handleSignOut}
                className="bg-blue-600 font-bold text-white p-2 text-sm rounded-lg cursor-pointer hover:bg-blue-500 transition-all"
              >
                Sign Out
              </span>
            </div>

            {/* Messages */}
            <p className="text-red-700 mt-4">{error || ''}</p>
            <p className="text-green-700 ml-[416px] mt-4">
              {updateSuccess ? 'User updated successfully!' : ''}
            </p>
          </>
        )}

        {/* Listings View */}
        {showOnlyListings && (
  <div className="w-full min-h-screen bg-gradient-to-br from-blue-800 via-black to-blue-950 px-4 ">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-yellow-400 mb-4">Your Listings</h2>
      <button
        onClick={() => setShowOnlyListings(false)}
        className="text-yellow-400 border border-yellow-500 px-8 py-3 text-lg rounded-full hover:bg-yellow-400 hover:text-black transition font-semibold"
      >
        ← Back to Profile
      </button>
    </div>

    {userListings?.length > 0 ? (
      <div className="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {userListings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-2xl shadow-2xl border border-yellow-400 overflow-hidden hover:shadow-yellow-300 transition-shadow duration-300"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="Listing cover"
                className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-6 space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 truncate">{listing.name}</h3>
              <p className="text-gray-600 text-sm truncate">{listing.address}</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/create-listing?edit=true&listingId=${listing._id}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-2 rounded-full font-semibold transition"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs px-5 py-2 rounded-full font-semibold transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-300 text-lg mt-10">
        You have no listings yet. Start by creating your first listing!
      </p>
    )}
  </div>
)}
{/* 
        {userListings?.length > 0 && showOnlyListings && (
          <div className="w-full grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-2xl shadow-2xl border border-yellow-400 overflow-hidden hover:shadow-yellow-300 transition-shadow duration-300"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing cover"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-6 space-y-2">
                  <h3 className="text-2xl font-bold text-blue-900 truncate">{listing.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{listing.address}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      to={`/create-listing?edit=true&listingId=${listing._id}`}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-2 rounded-full font-semibold transition"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs px-5 py-2 rounded-full font-semibold transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )} */}

        {/* Listings Error */}
        {showListingsError && (
          <p className="text-red-500 text-center mt-6 font-semibold">
            Error showing listings. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
