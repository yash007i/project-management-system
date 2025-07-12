import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {
  return (
    <div className="min-w-full">
      <ScrollToTop />
      <Navbar />
      {/* <main className="flex-1"> */}
      <Outlet />
      {/* </main> */}
      <Footer />
    </div>
  );
};

export default Layout;
