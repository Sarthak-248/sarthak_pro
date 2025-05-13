import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // Fetch user data on page load (including avatar)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}`);
        const data = await res.json();
        if (data.success) {
          setFormData({
            ...formData,
            avatar: data.user.avatar, // Update avatar if changed
            username: data.user.username,
            email: data.user.email
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser._id]);

  // Handle file upload to Cloudinary
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
  const formDataUpload = new FormData();
  formDataUpload.append('file', file);
  formDataUpload.append('upload_preset', 'sar_mor');

  try {
    // Step 1: Upload to Cloudinary
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dypvyjfgk/image/upload',
      formDataUpload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const imageUrl = response.data.secure_url;
    setFilePerc(100);

    // Step 2: Update avatar in backend
    const updateResponse = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add avatar URL to formData
      if (formData.avatar) {
        formData.avatar = formData.avatar;
      }

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
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

      setUserListings(data);
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

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-900 via-black to-blue-900 p-6 rounded-lg'>
      <h1 className='text-4xl font-bold text-center text-yellow-500 mb-8'>Profile</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-5 max-w-sm mx-auto'
      >
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer border-4 border-yellow-500 mb-4'
        />
        <p className='text-center text-yellow-400'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error uploading image (Image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span>Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>

        <input
          type='text'
          placeholder='Username'
          defaultValue={formData.username || currentUser.username}
          id='username'
          className='border-2 border-yellow-500 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={formData.email || currentUser.email}
          className='border-2 border-yellow-500 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleChange}
          id='password'
          className='border-2 border-yellow-500 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full'
        />

        <button
          disabled={loading}
          className='bg-yellow-500 text-blue-900 rounded-lg p-3 uppercase hover:bg-yellow-400 disabled:opacity-70 w-full'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-yellow-500 text-blue-900 p-3 rounded-lg uppercase text-center mt-3 hover:bg-yellow-400 w-full'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-center gap-4 mt-6'>
        <span
          onClick={handleDeleteUser}
          className='bg-red-600 mr-44 text-white p-2 rounded-lg text-sm cursor-pointer hover:bg-red-500 transition-all'
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className='bg-blue-600 text-white p-2 rounded-lg text-sm cursor-pointer hover:bg-blue-500 transition-all'
        >
          Sign Out
        </span>
      </div>

      <p className='text-red-700 mt-4'>{error ? error : ''}</p>
      <p className='text-green-700 ml-[416px] mt-4'>
        {updateSuccess ? 'User updated successfully!' : ''}
      </p>

      <div className='mt-6 flex flex-col items-center w-full'>
        <button
          onClick={handleShowListings}
          className='text-yellow-500 mb-4 text-center p-3 border-2 border-yellow-500 rounded-lg w-full max-w-sm'
        >
          Show Listings
        </button>

        <p className='text-red-700'>{showListingsError ? 'Error showing listings' : ''}</p>

        {userListings && userListings.length > 0 && (
          <div className='w-full max-w-sm'>
            <h2 className='text-center text-2xl font-bold text-yellow-500 mb-4'>
              Your Listings
            </h2>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border-2 border-yellow-500 p-4 mb-4 flex justify-between items-center gap-4 rounded-lg bg-white'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-cover'
                  />
                </Link>
                <Link
                  className='text-blue-900 font-semibold hover:text-blue-700 truncate flex-1'
                  to={`/listing/${listing._id}`}
                >
                  {listing.name}
                </Link>
                <div className='flex flex-col justify-between items-center'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='bg-red-600 text-white text-xs p-2 rounded-lg'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
