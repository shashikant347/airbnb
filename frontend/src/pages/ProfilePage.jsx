import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await API.put('/users/profile', profileData);
      updateUser(data.user);
      toast.success('Profile updated! ✨');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await API.put('/users/change-password', passwordData);
      toast.success('Password changed! 🔒');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    }
    setPasswordLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="section-title mb-8">My Profile</h1>

      {/* Profile Info Card */}
      <div className="card p-6 mb-6 border border-dark-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark-800">{user?.name}</h2>
            <p className="text-dark-400 text-sm">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-0.5 bg-primary-50 text-primary-600 text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="input-field pl-11" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="email" value={user?.email || ''} className="input-field pl-11 bg-dark-50" disabled />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Phone</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="input-field pl-11" placeholder="+1 234 567 890" />
            </div>
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <FiSave size={18} /> {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="card p-6 border border-dark-100">
        <h3 className="text-lg font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <FiLock /> Change Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Current Password</label>
            <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">New Password</label>
            <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="input-field" required minLength={6} />
          </div>
          <button type="submit" disabled={passwordLoading} className="btn-outline flex items-center gap-2 disabled:opacity-50">
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
