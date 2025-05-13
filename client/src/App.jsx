// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Faq from './pages/Faq';
import RecentlyVisited from './components/RecentlyVisited'; // Adjust path if needed
import FavoritesPage from './components/FavoritesPage';
import ComparePage from './components/Compare'; // NEW

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/compare' element={<ComparePage />} /> {/* NEW */}

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path="/recently-visited" element={<RecentlyVisited />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
