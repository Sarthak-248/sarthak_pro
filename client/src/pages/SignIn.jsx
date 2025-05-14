import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-black to-blue-900 flex items-center justify-center">
      <div className="p-8 sm:p-10 max-w-lg w-full bg-gradient-to-r from-blue-800 via-black to-blue-900 bg-opacity-90 rounded-2xl shadow-2xl">
        <h1 className="text-4xl text-center font-semibold text-yellow-400 my-5">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-yellow-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white bg-transparent"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-yellow-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white bg-transparent"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-yellow-500 text-black p-3 rounded-lg uppercase hover:bg-yellow-400 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          
        </form>
        <div className="flex gap-2 mt-5 justify-center">
          <p className="text-white">Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-yellow-300 hover:text-yellow-400 cursor-pointer">Sign Up</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      </div>
    </div>
  );
}
