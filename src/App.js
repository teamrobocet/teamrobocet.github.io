import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import KnowMore from './pages/KnowMore';
import GalleryPage from './pages/GalleryPage';
import SponsorPage from './pages/SponsorPage';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import Admin from './pages/Admin';
import AdminCategory from './pages/AdminCategory';
import AdminGallery from './pages/AdminGallery';
import AchievementsPage from './pages/AchievementsPage';
import AdminAchievement from './pages/AdminAchievement';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import TournamentPage from './pages/TournamentPage';
import AdminTournamentList from './pages/AdminTournamentList';
import AdminTournamentManage from './pages/AdminTournamentManage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home isLoading={isLoading} />} />
              <Route path="/know-more" element={<KnowMore />} />
              <Route path="/about" element={<KnowMore />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/sponsor" element={<SponsorPage />} />
              <Route path="/events/:categoryId" element={<CategoryPage />} />
              <Route path="/register/:eventId" element={<Register />} />
              
              {/* Admin Auth Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/gallery" element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              } />
              <Route path="/admin/:categoryId" element={
                <ProtectedRoute>
                  <AdminCategory />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/admin/achievements" element={
                <ProtectedRoute>
                  <AdminAchievement />
                </ProtectedRoute>
              } />
              
              {/* Tournament Routes */}
              <Route path="/drishti/:tournamentId" element={<TournamentPage />} />
              <Route path="/admin/tournaments" element={
                <ProtectedRoute>
                  <AdminTournamentList />
                </ProtectedRoute>
              } />
              <Route path="/admin/tournaments/:tournamentId" element={
                <ProtectedRoute>
                  <AdminTournamentManage />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </div>
        </Router>

      {/* Render Preloader on top of everything else */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
    </>
  );
}

export default App;
