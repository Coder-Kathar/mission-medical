import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestCart from "./pages/RequestCart";
import RequestPreview from "./pages/RequestPreview";
import { ProductProvider } from "./context/ProductContext";
import { RequestProvider } from "./context/RequestContext";
import OTPVerification from "./pages/OTPVerification";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import LoginSelection from "./pages/LoginSelection";
import AdminLogin from "./pages/AdminLogin";
import WorkerLogin from "./pages/WorkerLogin";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Worker from "./pages/Worker";
import Admin from "./pages/Admin";


function App() {
  return (
    
    <RequestProvider>
      <ProductProvider>
        <AuthProvider>
            <BrowserRouter>
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/login" element={<LoginSelection />} />
                <Route path="/customer-login" element={<Login/>}/>
                <Route path="/register" element={<Register />} />
                <Route path="/request" 
                        element={
                          <ProtectedRoute>
                            <RequestCart/>
                          </ProtectedRoute>
                        }/>
                <Route path="/request-preview" element={<RequestPreview/>}/>
                <Route path="/worker" element={<Worker/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/verify-otp" element={<OTPVerification/>}/>
                <Route path="/admin/orders" element={<AdminOrders/>}/>
                <Route path="/admin/products" element={<AdminProducts/>}/>
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/worker-login" element={<WorkerLogin />} />
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
        </AuthProvider>
      </ProductProvider>
    </RequestProvider>
  );
}

export default App;