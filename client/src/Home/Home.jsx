import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-pink-500">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to Our Portal
      </h1>
      <div className="space-x-4">
        <Link
          to="/user"
          className="bg-white text-purple-500 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition duration-300"
        >
          USER
        </Link>
        <Link
          to="/login"
          className="bg-white text-pink-500 px-6 py-3 rounded-full font-semibold hover:bg-pink-100 transition duration-300"
        >
          ADMIN
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
