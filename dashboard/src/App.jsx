import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import OrderList from './pages/Admin/OrderList.jsx';
import ProductList from './pages/Admin/ProductList.jsx';
import ProductEdit from './pages/Admin/ProductEdit.jsx';
import ToppingList from './pages/Admin/ToppingList.jsx';
import UserList from './pages/Admin/UserList.jsx';
import VoucherList from './pages/Admin/VoucherList.jsx';
import VoucherEdit from './pages/Admin/VoucherEdit.jsx';
import SiteSettings from './pages/Admin/SiteSettings.jsx';
import ReviewList from './pages/Admin/ReviewList.jsx';
import SalesStats from './pages/Admin/SalesStats.jsx';
import UserOrderHistory from './pages/Admin/UserOrderHistory.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductEdit />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="toppings" element={<ToppingList />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id/orders" element={<UserOrderHistory />} />
          <Route path="vouchers" element={<VoucherList />} />
          <Route path="vouchers/add" element={<VoucherEdit />} />
          <Route path="vouchers/edit/:id" element={<VoucherEdit />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="reviews" element={<ReviewList />} />
          <Route path="stats" element={<SalesStats />} />
        </Route>
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
