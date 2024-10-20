import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="overflow-x-hidden flex items-center justify-center h-screen text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
    <div className="fixed top-0 -z-10 h-full w-full">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
    </div>

    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome to Our Portal
      </h1>
      <div className="space-x-4">
        <Link
          to="/user"
          className="bg-white text-purple-500 px-6 py-3 rounded-full font-semibold hover:bg-purple-100 transition duration-300"
        >
          Result
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
