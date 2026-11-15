import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "../guards/ProtectedRoute";
import AdminRoute from "../guards/AdminRoute";
import SellerRoute from "../guards/SellerRoute";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import Cart from "../pages/customer/Cart";
import Addresses from "../pages/customer/Addresses";
import Checkout from "../pages/customer/Checkout";
import MyOrders from "../pages/customer/MyOrders";
import OrderDetails from "../pages/customer/OrderDetails";
import Recommendations from "../pages/customer/Recommendations";
import Coupons from "../pages/customer/Coupons";
import Referral from "../pages/customer/Referral";
import Notifications from "../pages/customer/Notifications";
import Favorites from "../pages/customer/Favorites";
import FollowingSellers from "../pages/customer/FollowingSellers";

import AccountSwitch from "../pages/account/AccountSwitch";
import Profile from "../pages/profile/Profile";

import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProfile from "../pages/seller/SellerProfile";
import SellerProducts from "../pages/seller/Products";
import AddProduct from "../pages/seller/AddProduct";
import EditProduct from "../pages/seller/EditProduct";
import SellerOrders from "../pages/seller/SellerOrders";
import Analytics from "../pages/seller/Analytics";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import Sellers from "../pages/admin/Sellers";
import Customers from "../pages/admin/Customers";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminCoupons from "../pages/admin/Coupons";


const NotAuthorized = () => (
  <div className="not-authorized-page">
    <h2>
      You are not authorized to access this page.
    </h2>
  </div>
);


const AppRoutes = () => (
  <Routes>

    {/* ================= PUBLIC ================= */}

    <Route
      path="/"
      element={<Home />}
    />

    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    <Route
      path="/forgot-password"
      element={<ForgotPassword />}
    />

    <Route
      path="/not-authorized"
      element={<NotAuthorized />}
    />


    {/* ================= AUTHENTICATED ================= */}

    <Route element={<ProtectedRoute />}>

      <Route
        path="/customer/dashboard"
        element={
          <Navigate
            to="/products"
            replace
          />
        }
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/addresses"
        element={<Addresses />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/orders"
        element={<MyOrders />}
      />

      <Route
        path="/orders/:id"
        element={<OrderDetails />}
      />

      <Route
        path="/recommendations"
        element={<Recommendations />}
      />

      <Route
        path="/coupons"
        element={<Coupons />}
      />

      <Route
        path="/referral"
        element={<Referral />}
      />

      <Route
        path="/notifications"
        element={<Notifications />}
      />

      <Route
        path="/favorites"
        element={<Favorites />}
      />

      <Route
        path="/following-sellers"
        element={<FollowingSellers />}
      />

      <Route
        path="/account/switch"
        element={<AccountSwitch />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Route>


    {/* ================= SELLER ================= */}

    <Route element={<SellerRoute />}>

      <Route
        path="/seller/dashboard"
        element={<SellerDashboard />}
      />

      <Route
        path="/seller/profile"
        element={<SellerProfile />}
      />

      <Route
        path="/seller/products"
        element={<SellerProducts />}
      />

      <Route
        path="/seller/products/add"
        element={<AddProduct />}
      />

      <Route
        path="/seller/products/edit/:id"
        element={<EditProduct />}
      />

      <Route
        path="/seller/orders"
        element={<SellerOrders />}
      />

      <Route
        path="/seller/analytics"
        element={<Analytics />}
      />

    </Route>


    {/* ================= ADMIN ================= */}

    <Route element={<AdminRoute />}>

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/users"
        element={<Users />}
      />

      <Route
        path="/admin/sellers"
        element={<Sellers />}
      />

      <Route
        path="/admin/customers"
        element={<Customers />}
      />

      <Route
        path="/admin/profile"
        element={<AdminProfile />}
      />

      <Route
        path="/admin/coupons"
        element={<AdminCoupons />}
      />

    </Route>


    {/* ================= INVALID URL ================= */}

    <Route
      path="*"
      element={
        <Navigate
          to="/"
          replace
        />
      }
    />

  </Routes>
);

export default AppRoutes;