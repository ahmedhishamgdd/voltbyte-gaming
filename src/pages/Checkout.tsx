import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CreditCard, Paypal, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, promoCode, discount } = useCart();

  const [step, setStep] = useState<'shipping' | 'billing' | 'payment'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'paymob'>('stripe');
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shippingCost = subtotal > 500 ? 0 : 15;
  const total = subtotal - discountAmount + shippingCost;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validateShipping = () => {
    return (
      shippingData.firstName &&
      shippingData.lastName &&
      shippingData.email &&
      shippingData.phone &&
      shippingData.address &&
      shippingData.city &&
      shippingData.zipCode &&
      shippingData.country
    );
  };

  const validatePayment = () => {
    return paymentData.cardNumber && paymentData.cardHolder && paymentData.expiryDate && paymentData.cvv;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      alert(t('checkout.fillRequired'));
      return;
    }

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      // Store order in localStorage (or send to backend)
      const order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: cart,
        shipping: shippingData,
        billing: billingData,
        payment: paymentMethod,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      setLoading(false);
      navigate('/order-confirmation', { state: { order } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {t('checkout.backToCart')}
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('checkout.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
              {/* Step Indicators */}
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                {(['shipping', 'billing', 'payment'] as const).map((s, idx) => (
                  <button
                    key={s}
                    onClick={() => step === 'shipping' && idx === 1 && validateShipping() ? setStep(s) : undefined}
                    className={`flex-1 py-4 text-center font-bold border-b-2 transition-all ${
                      step === s
                        ? 'border-red-600 text-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {idx + 1}. {t(`checkout.${s}`)}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {/* Shipping Form */}
                {step === 'shipping' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkout.shippingAddress')}</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder={t('checkout.firstName')}
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder={t('checkout.lastName')}
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder={t('checkout.email')}
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t('checkout.phone')}
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <input
                      type="text"
                      name="address"
                      placeholder={t('checkout.address')}
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder={t('checkout.city')}
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder={t('checkout.state')}
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="zipCode"
                        placeholder={t('checkout.zipCode')}
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <input
                        type="text"
                        name="country"
                        placeholder={t('checkout.country')}
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <button
                      onClick={() => setStep('billing')}
                      disabled={!validateShipping()}
                      className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
                    >
                      {t('checkout.nextStep')}
                    </button>
                  </motion.div>
                )}

                {/* Billing Form */}
                {step === 'billing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkout.billingAddress')}</h2>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={billingData.sameAsShipping}
                        onChange={(e) => setBillingData((prev) => ({ ...prev, sameAsShipping: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-900 dark:text-white">{t('checkout.sameAsShipping')}</span>
                    </label>

                    {!billingData.sameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder={t('checkout.firstName')}
                            value={billingData.firstName}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          <input
                            type="text"
                            name="lastName"
                            placeholder={t('checkout.lastName')}
                            value={billingData.lastName}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>

                        <input
                          type="text"
                          name="address"
                          placeholder={t('checkout.address')}
                          value={billingData.address}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="city"
                            placeholder={t('checkout.city')}
                            value={billingData.city}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          <input
                            type="text"
                            name="state"
                            placeholder={t('checkout.state')}
                            value={billingData.state}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="zipCode"
                            placeholder={t('checkout.zipCode')}
                            value={billingData.zipCode}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          <input
                            type="text"
                            name="country"
                            placeholder={t('checkout.country')}
                            value={billingData.country}
                            onChange={handleBillingChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep('shipping')}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {t('checkout.back')}
                      </button>
                      <button
                        onClick={() => setStep('payment')}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
                      >
                        {t('checkout.nextStep')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Payment Form */}
                {step === 'payment' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('checkout.paymentMethod')}</h2>

                    <div className="space-y-3">
                      {(['stripe', 'paypal', 'paymob'] as const).map((method) => (
                        <label key={method} className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:border-red-600 transition-colors" style={{ borderColor: paymentMethod === method ? '#dc2626' : undefined }}>
                          <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-4 h-4"
                          />
                          <div className="flex items-center gap-2">
                            {method === 'stripe' && <CreditCard size={24} className="text-blue-600" />}
                            {method === 'paypal' && <Paypal size={24} className="text-blue-500" />}
                            {method === 'paymob' && <CreditCard size={24} className="text-purple-600" />}
                            <span className="font-bold text-gray-900 dark:text-white capitalize">{method}</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'stripe' && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="4532 1234 5678 9010"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentChange}
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        />

                        <input
                          type="text"
                          name="cardHolder"
                          placeholder={t('checkout.cardHolder')}
                          value={paymentData.cardHolder}
                          onChange={handlePaymentChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            maxLength={5}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            maxLength={4}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{t('checkout.testCard')}</p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep('billing')}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {t('checkout.back')}
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-bold transition-colors"
                      >
                        {loading ? t('checkout.processing') : t('checkout.placeOrder')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 sticky top-24 space-y-4"
            >
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('checkout.orderSummary')}</h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pb-4 border-b border-gray-200 dark:border-gray-800">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('checkout.subtotal')}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('checkout.discount')}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('checkout.shipping')}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 pt-4">
                <span>{t('checkout.total')}</span>
                <span className="text-red-600">${total.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
