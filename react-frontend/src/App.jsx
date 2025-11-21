import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/products/ProductsList';
import ProductForm from './pages/products/ProductForm';
import ProductDetails from './pages/products/ProductDetails';
import OrdersList from './pages/orders/OrdersList';
import OrderForm from './pages/orders/OrderForm';
import OrderDetails from './pages/orders/OrderDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}