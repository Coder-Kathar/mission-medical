import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestCart from "./pages/RequestCart";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";


function App() {
  return (
    
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/request" element={<RequestCart/>}/>
            <Route path="/orders" 
                    element={
                        <ProtectedRoute>
                            <Orders/>
                        </ProtectedRoute>
                      } />
            <Route path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                      } />
          </Routes>

          <Footer/>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;