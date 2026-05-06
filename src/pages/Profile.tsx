import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, MapPin, ShoppingBag, LogOut, Bell, Settings, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'info' | 'addresses' | 'orders' | 'wishlist'>('info');
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 234 567 8900',
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      address: '123 Gaming Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      default: true,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 1299.99,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      total: 599.99,
      status: 'shipped',
      items: 2,
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileUpdate = () => {
    setEditMode(false);
    // Save profile data
  };

  const handleAddAddress = () => {
    navigate('/profile/add-address');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('profile.myAccount')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('profile.welcome')}, {user?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              {/* Profile Card */}
              <div className="p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
                <h3 className="font-bold text-lg">{user?.name}</h3>
                <p className="text-sm opacity-90">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2">
                {[
                  { id: 'info', label: t('profile.personalInfo'), icon: User },
                  { id: 'addresses', label: t('profile.addresses'), icon: MapPin },
                  { id: 'orders', label: t('profile.orderHistory'), icon: ShoppingBag },
                  { id: 'wishlist', label: t('profile.wishlist'), icon: Heart },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-bold">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Settings size={20} />
                  <span className="font-bold">{t('profile.settings')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-bold">{t('profile.logout')}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Personal Information */}
            {activeTab === 'info' && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.personalInfo')}</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                  >
                    {editMode ? t('profile.cancel') : t('profile.edit')}
                  </button>
                </div>

                {editMode ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">{t('profile.fullName')}</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">{t('profile.email')}</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white opacity-50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">{t('profile.phone')}</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <button
                      onClick={handleProfileUpdate}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                    >
                      {t('profile.save')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.fullName')}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{profileData.name}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.email')}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{profileData.email}</p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.phone')}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{profileData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile.savedAddresses')}</h2>
                  <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                  >
                    + {t('profile.addNew')}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-600 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-gray-900 dark:text-white">{addr.type}</span>
                        {addr.default && <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded font-bold">{t('profile.default')}</span>}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{addr.address}</p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{addr.country}</p>
                      <div className="flex gap-2 mt-4">
                        <button className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm font-bold transition-colors">
                          {t('profile.edit')}
                        </button>
                        <button className="px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm font-bold transition-colors">
                          {t('profile.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('profile.orderHistory')}</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.orderID')}</th>
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.date')}</th>
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.items')}</th>
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.total')}</th>
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.status')}</th>
                        <th className="text-left py-3 font-bold text-gray-900 dark:text-white">{t('profile.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 font-bold text-gray-900 dark:text-white">{order.id}</td>
                          <td className="py-4 text-gray-700 dark:text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-4 text-gray-700 dark:text-gray-300">{order.items}</td>
                          <td className="py-4 font-bold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                          <td className="py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4">
                            <button className="text-red-600 hover:text-red-700 font-bold">{t('profile.view')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('profile.wishlist')}</h2>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{t('profile.emptyWishlist')}</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                    >
                      {t('profile.startShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                      <div key={product.id} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="bg-gray-100 dark:bg-gray-800 h-48 flex items-center justify-center">
                          <span className="text-gray-400">{product.name}</span>
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-gray-900 dark:text-white mb-2">{product.name}</p>
                          <p className="text-red-600 font-bold text-lg mb-4">${product.price.toFixed(2)}</p>
                          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors">
                            {t('profile.addToCart')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
