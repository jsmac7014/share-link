import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "meteor/react-meteor-accounts";


export default function Navbar() {
  // const user = useTracker(() => Meteor.user());
  const user = useUser();
  
  const name = user ? user.profile.name : "";
  const username = user ? user.username : "";

  return (
    <nav className="flex items-center justify-between h-20 px-4 bg-white shadow">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 400 400"
          >
            <g fill="#DE4F4F">
              <path d="M286.575 306.886L44.755 49.922l256.962 241.82c4.312 4.056 4.518 10.837.46 15.146-4.053 4.31-10.832 4.518-15.144.46-.15-.14-.318-.31-.458-.462M251.032 325.01L68.692 127.528 266.177 309.87c4.35 4.013 4.618 10.794.604 15.144-4.018 4.35-10.794 4.617-15.146.604-.2-.19-.413-.406-.602-.607M214.083 325.542L92.907 194.272 224.18 315.446c2.898 2.676 3.077 7.197.402 10.098-2.677 2.896-7.195 3.082-10.097.402-.136-.125-.277-.272-.402-.405M315.612 234.685L189.102 98.078 325.71 224.585c2.896 2.684 3.067 7.203.387 10.1-2.682 2.895-7.2 3.066-10.098.387-.13-.123-.268-.258-.388-.387M304.697 272.93L121.567 74.655l198.274 183.13c4.35 4.017 4.62 10.796.605 15.144-4.017 4.352-10.797 4.617-15.146.604-.205-.19-.418-.404-.603-.605M176.31 314.783l-57.647-62.695 62.692 57.65c1.453 1.334 1.547 3.596.215 5.045-1.338 1.453-3.598 1.55-5.05.215-.072-.07-.144-.143-.21-.215M311.093 189.297l-57.65-62.694 62.696 57.646c1.45 1.335 1.546 3.597.21 5.048-1.335 1.45-3.595 1.547-5.05.21-.07-.065-.143-.143-.207-.21" />
            </g>
          </svg>
        </Link>
        <ul>
          {/* Menu */}
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>

      {/* Sign In / Sign Up Buttons when not logged in */}
      <div className="flex items-center gap-4">
        {user === null ? (
          <>
            <Link to="/sign-in" className="text-gray-400 underline text-md">
              Sign In
            </Link>
            <Link to="/sign-up" className="text-gray-400 underline text-md">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative text-left">
            {/* Toggle Button */}
            <input
              type="checkbox"
              id="dropdown-toggle"
              className="hidden peer"
            />
            <label
              htmlFor="dropdown-toggle"
              className="flex items-center gap-2 px-3 py-2 cursor-pointer peer"
            >
              <span>{name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </label>

            {/* Dropdown Menu */}
            <div className="absolute right-0 invisible w-full mt-2 transition-all duration-150 bg-white rounded-md shadow-lg opacity-0 ring-1 ring-black ring-opacity-5 peer-checked:visible peer-checked:opacity-100">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <span
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  {username}
                </span>
                <button
                  onClick={() => Meteor.logout()}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
