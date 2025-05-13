import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sar_mor');
    formData.append('cloud_name', 'dypvyjfgk');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dypvyjfgk/image/upload', formData);
      return response.data.secure_url;
    } catch (error) {
      throw new Error('Cloudinary upload failed');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      ['number', 'text', 'textarea'].includes(e.target.type)
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 via-black to-blue-900 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-6 max-w-lg w-full bg-blue-900 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-semibold text-center text-yellow-500 my-4">
          Create a Listing
        </h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border-2 border-yellow-400 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border-2 border-yellow-400 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border-2 border-yellow-400 p-3 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            {['sale', 'rent', 'parking', 'furnished', 'offer'].map((id) => (
              <div key={id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={id}
                  className="w-5"
                  onChange={handleChange}
                  checked={formData[id] ?? formData.type === id}
                />
                <span className="text-yellow-400 capitalize">{id === 'sale' ? 'Sell' : id}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { id: 'bedrooms', label: 'Beds' },
              { id: 'bathrooms', label: 'Baths' },
              { id: 'regularPrice', label: 'Regular price', note: formData.type === 'rent' ? '($ / month)' : '' },
            ].map(({ id, label, note }) => (
              <div key={id} className="flex items-center gap-2">
                <input
                  type="number"
                  id={id}
                  min="1"
                  max="10000000"
                  required
                  className="p-3 border-2 border-yellow-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={handleChange}
                  value={formData[id]}
                />
                <div className="flex flex-col items-center">
                  <p className="text-yellow-400">{label}</p>
                  {note && <span className="text-xs text-yellow-300">{note}</span>}
                </div>
              </div>
            ))}
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border-2 border-yellow-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p className="text-yellow-400">Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className="text-xs text-yellow-300">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-semibold text-yellow-400">
            Images:
            <span className="font-normal text-yellow-400 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border-2 border-yellow-400 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-white bg-yellow-400 rounded-lg uppercase hover:bg-yellow-500 disabled:opacity-80"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>

          {formData.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="relative group border-2 border-yellow-300 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white"
                >
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700 transition duration-200 opacity-80 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={loading || uploading}
            className="p-3 bg-yellow-400 text-black rounded-lg uppercase hover:bg-yellow-500 disabled:opacity-80"
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
