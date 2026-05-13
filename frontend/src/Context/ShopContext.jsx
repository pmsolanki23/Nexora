import { createContext, useEffect, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  // =========================
  // BASIC CONFIG
  // =========================

  const currency = "$";

  const delivery_fee = 10;

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [search, setsearch] = useState("");

  const [showsearch, setshowsearch] = useState(false);

  const [cartitem, setcartitem] = useState({});

  const [products, setproducts] = useState([]);

  const [loading, setloading] = useState(false);

  const [token, settoken] = useState(localStorage.getItem("token") || "");

  // =========================
  // USER PROFILE STATES
  // =========================

  const [userData, setuserData] = useState(null);

  const [wishlist, setwishlist] = useState([]);

  const [recentlyViewed, setrecentlyViewed] = useState([]);

  const [addresses, setaddresses] = useState([]);

  // =========================
  // AXIOS INSTANCE
  // =========================

  const api = axios.create({
    baseURL: backendurl,
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.token = token;
    }

    return config;
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  const getproductdata = async () => {
    try {
      setloading(true);

      const response = await api.get("/api/product/list");

      if (response.data.success) {
        setproducts(response.data.products || response.data.product);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    } finally {
      setloading(false);
    }
  };

  // =========================
  // GET USER PROFILE
  // =========================

  const getUserProfile = async () => {
    try {
      const response = await api.get("/api/user/profile");

      if (response.data.success) {
        const user = response.data.user;

        setuserData(user);

        setwishlist(user.wishlist || []);

        setrecentlyViewed(user.recentlyViewed || []);

        setaddresses(user.addresses || []);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const addtocart = async (id, size, color = null) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Cart key includes color if variant
    const cartKey = color ? `${id}__${color}` : id;

    let cartdata = structuredClone(cartitem);

    if (cartdata[cartKey]) {
      if (cartdata[cartKey][size]) {
        cartdata[cartKey][size] += 1;
      } else {
        cartdata[cartKey][size] = 1;
      }
    } else {
      cartdata[cartKey] = {};
      cartdata[cartKey][size] = 1;
    }

    setcartitem(cartdata);

    if (!token) {
      toast.error("Please Login");
      return;
    }

    try {
      const response = await api.post("/api/cart/add", {
        itemId: id,
        size,
        color,
      });

      if (response.data.success) {
        toast.success("Added To Cart");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updatequantity = async (id, size, quantity) => {
    let cartdata = structuredClone(cartitem);

    cartdata[id][size] = quantity;

    setcartitem(cartdata);

    if (!token) return;

    try {
      await api.post("/api/cart/update", {
        itemId: id,
        size,
        quantity,
      });
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // CART COUNT
  // =========================

  const cartcount = () => {
    let totalcount = 0;

    for (const items in cartitem) {
      for (const size in cartitem[items]) {
        if (cartitem[items][size] > 0) {
          totalcount += cartitem[items][size];
        }
      }
    }

    return totalcount;
  };

  // =========================
  // CART AMOUNT
  // =========================

  const cartamount = () => {
    let totalamount = 0;

    for (const items in cartitem) {
      let iteminfo = products.find((product) => product._id === items);

      if (!iteminfo) continue;

      for (const item in cartitem[items]) {
        try {
          if (cartitem[items][item] > 0) {
            totalamount += iteminfo.price * cartitem[items][item];
          }
        } catch (error) {}
      }
    }

    return totalamount;
  };

  // =========================
  // GET USER CART
  // =========================

  const getusercart = async () => {
    try {
      const response = await api.post("/api/cart/get");

      if (response.data.success) {
        setcartitem(response.data.cartData || response.data.cartdata);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // ADD TO WISHLIST
  // =========================

  const addToWishlist = async (productId) => {
    try {
      const response = await api.post("/api/user/add-wishlist", {
        productId,
      });

      if (response.data.success) {
        setwishlist(response.data.wishlist);

        getUserProfile();

        toast.success("Added To Wishlist");
      } else {
        toast.error(response.data.message || "Unable to add wishlist");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // REMOVE FROM WISHLIST
  // =========================

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.post("/api/user/remove-wishlist", {
        productId,
      });

      if (response.data.success) {
        setwishlist(response.data.wishlist);

        getUserProfile();

        toast.success("Removed From Wishlist");
      } else {
        toast.error(response.data.message || "Unable to remove wishlist");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // ADD ADDRESS
  // =========================

  const addAddress = async (addressData) => {
    try {
      const response = await api.post("/api/user/add-address", addressData);

      if (response.data.success) {
        setaddresses(response.data.addresses);

        toast.success("Address Added");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const deleteAddress = async (addressId) => {
    try {
      const response = await api.post("/api/user/delete-address", {
        addressId,
      });

      if (response.data.success) {
        setaddresses(response.data.addresses);

        toast.success("Address Deleted");
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // UPDATE ADDRESS
  // =========================
  // =========================
  // UPDATE ADDRESS
  // =========================

  const updateAddress = async (addressId, updatedAddress) => {
    try {
      const response = await api.post("/api/user/update-address", {
        addressId,
        updatedAddress,
      });

      if (response.data.success) {
        setaddresses(response.data.addresses);

        toast.success("Address Updated");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.post("/api/user/update-profile", profileData);

      if (response.data.success) {
        setuserData(response.data.user);

        toast.success(response.data.message || "Profile Updated");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // RECENTLY VIEWED
  // =========================

  const addRecentlyViewed = async (productId) => {
    try {
      await api.post("/api/user/recently-viewed", {
        productId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");

    settoken("");

    setcartitem({});

    setuserData(null);

    setwishlist([]);

    setaddresses([]);

    setrecentlyViewed([]);

    toast.success("Logged Out");

    navigate("/login");
  };

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    getproductdata();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      getusercart();

      getUserProfile();
    }
  }, [token]);

  // =========================
  // CONTEXT VALUE
  // =========================

  const value = {
    // PRODUCTS

    products,
    setproducts,

    // BASIC

    currency,
    delivery_fee,

    // SEARCH

    search,
    setsearch,

    showsearch,
    setshowsearch,

    // CART

    cartitem,
    setcartitem,

    addtocart,

    cartcount,

    updatequantity,

    cartamount,

    // USER

    token,
    settoken,

    userData,
    setuserData,

    // WISHLIST

    wishlist,
    setwishlist,

    addToWishlist,

    removeFromWishlist,

    // RECENTLY VIEWED

    recentlyViewed,
    setrecentlyViewed,

    addRecentlyViewed,

    // ADDRESSES

    addresses,
    setaddresses,

    addAddress,

    deleteAddress,

    updateAddress,
    // PROFILE

    getUserProfile,
    updateUserProfile,

    // SYSTEM

    navigate,
    backendurl,
    loading,
    logout,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
