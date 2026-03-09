import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import WishlistPage from './pages/WishlistPage';
import HostDashboard from './pages/HostDashboard';
import AddPropertyPage from './pages/AddPropertyPage';
import ManageListingsPage from './pages/ManageListingsPage';
import HostBookingsPage from './pages/HostBookingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="property/:id" element={<PropertyDetailsPage />} />

        {/* User Protected Routes */}
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

        {/* Host Protected Routes */}
        <Route path="host/dashboard" element={<ProtectedRoute hostOnly><HostDashboard /></ProtectedRoute>} />
        <Route path="host/add-property" element={<ProtectedRoute hostOnly><AddPropertyPage /></ProtectedRoute>} />
        <Route path="host/listings" element={<ProtectedRoute hostOnly><ManageListingsPage /></ProtectedRoute>} />
        <Route path="host/bookings" element={<ProtectedRoute hostOnly><HostBookingsPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
