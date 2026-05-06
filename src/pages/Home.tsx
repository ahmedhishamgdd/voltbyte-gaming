import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Zap, Cpu, Shield, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getNewProducts, getHotProducts } from '../data/products';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const newProducts = getNewProducts();
  const hotProducts = getHotProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Animated Plexus Background */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        {/* Animated Background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#glow)">
            <circle cx="100" cy="100" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="1100" cy="500" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="600" cy="300" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="200" cy="400" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="1000" cy="100" r="3" fill="#dc2626" className="animate-pulse" />
            <line x1="100" y1="100" x2="600" y2="300" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="300" x2="1100" y2="500" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
            <line x1="1100" y1="500" x2="200" y2="400" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
            <line x1="200" y1="400" x2="1000" y2="100" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
          </g>
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="text-red-500 font-bold text-lg">⚡ Gaming Gear Revolution</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              Power Your
              <span className="text-red-600"> Gaming</span>
              <br />
              Rig Today
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/shop')}
                className="group px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105"
              >
                {t('hero.shopNow')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/pc-builder')}
                className="px-8 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold transition-all"
              >
                {t('hero.buildPC')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Zap, title: 'Fast Shipping', desc: '2-3 days delivery' },
              { icon: Shield, title: 'Secure Payment', desc: 'Encrypted transactions' },
              { icon: Truck, title: 'Free Returns', desc: '30-day return policy' },
              { icon: Cpu, title: 'Expert Support', desc: '24/7 customer service' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-lg transition-shadow"
              >
                <feature.icon size={40} className="mx-auto text-red-600 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hot Products Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              🔥 {t('home.hotProducts')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.bestSellers')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {hotProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
            >
              {t('home.viewAll')}
            </button>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              ✨ {t('home.newArrivals')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.latestProducts')}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {newProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">{t('home.ctaTitle')}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">{t('home.ctaSubtitle')}</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-white text-red-600 hover:bg-gray-100 rounded-lg font-bold transition-colors inline-block"
            >
              {t('home.startShopping')}
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
