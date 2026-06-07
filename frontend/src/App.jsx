import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ChatWidget from './components/Chatbot/ChatWidget.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Lazy loaded Pages (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage.jsx'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage.jsx'));
const MenuProductsPage = lazy(() => import('./pages/MenuProductsPage.jsx'));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const PaymentResult = lazy(() => import('./pages/PaymentResult.jsx'));

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
            <Routes>
              {/* Store Routes (With Header & Footer) */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main style={{ flex: 1 }}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/menu/products" element={<MenuProductsPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment-result" element={<PaymentResult />} />
                      <Route path="/history" element={<OrderHistoryPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:id" element={<BlogDetailPage />} />
                      <Route path="/promotions" element={<PromotionsPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />

            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
      <ChatWidget />
    </Router>
  );
}

export default App;
