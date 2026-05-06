import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../data/products';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity, promoCode, setPromoCode, applyPromoCode, discount } = useCart();
  const [couponInput, setCouponInput] = useState('');

  const suggestedProducts = getProducts().slice(0, 4);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shippingCost = subtotal > 500 ? 0 : 15;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = () => {
    applyPromoCode(couponInput);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('cart.continueShopping')}
          </button>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('cart.empty')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">{t('cart.emptyMessage')}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
            >
              {t('cart.startShopping')}
            </button>
          </div>

          {/* Suggested Products */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('cart.suggested')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('cart.continueShopping')}
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('cart.yourCart')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cart.length} {t('cart.items')}
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {cart.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 flex gap-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-sm text-gray-500">{item.name.substring(0, 3)}</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.brand}</p>
                      <p className="font-bold text-red-600 text-lg">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="flex flex-col items-end gap-4">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 h-fit space-y-6"
          >
            {/* Coupon Code */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{t('cart.promoCode')}</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('cart.enterCode')}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                  >
                    {t('cart.apply')}
                  </button>
                </div>
                {promoCode && (
                  <p className="text-sm text-green-600 font-bold">
                    ✓ {promoCode} {t('cart.applied')}
                  </p>
                )}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 {t('cart.tryCoupon')}: VOLT10, VOLT20, GAMING15
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('cart.orderSummary')}</h3>

              <div className="space-y-3 text-sm py-4 border-y border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>{t('cart.discount')} ({Math.round(discount * 100)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.shipping')}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>

                {subtotal > 500 && (
                  <div className="text-xs text-green-600">✓ {t('cart.freeShipping')}</div>
                )}
              </div>

              <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-gray-900 dark:text-white">{t('cart.total')}</span>
                <span className="font-bold text-red-600 text-2xl">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors"
              >
                {t('cart.checkout')}
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full px-6 py-2 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t('cart.continueShopping')}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ℹ️ {t('cart.shippingInfo')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
