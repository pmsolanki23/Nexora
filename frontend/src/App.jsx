import React from "react";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./Components/ScrollToTop";
import ShopContextProvider from "./Context/ShopContext";
import RouteTransitionProvider from "./Components/RouteTransitionProvider";

const App = () => {
  return (
    <ShopContextProvider>
      <ToastContainer />

      <RouteTransitionProvider>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-[#080b10] text-[#111827] font-sans shop-noise">
          <header className="z-50">
            <Navbar />
          </header>

          <main className="flex-grow px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8">
            <Outlet />
          </main>

          <footer>
            <Footer />
          </footer>
        </div>
      </RouteTransitionProvider>
    </ShopContextProvider>
  );
};

export default App;
