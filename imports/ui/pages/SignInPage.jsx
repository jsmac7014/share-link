import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        setError(error.reason);
      } else {
        setError("");
        navigate("/");
      }
    });
  }
  
  return (
    <div className="flex flex-col items-center justify-center max-w-md min-h-screen gap-5 mx-auto">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 400 400"
      >
        <g fill="#DE4F4F">
          <path d="M286.575 306.886L44.755 49.922l256.962 241.82c4.312 4.056 4.518 10.837.46 15.146-4.053 4.31-10.832 4.518-15.144.46-.15-.14-.318-.31-.458-.462M251.032 325.01L68.692 127.528 266.177 309.87c4.35 4.013 4.618 10.794.604 15.144-4.018 4.35-10.794 4.617-15.146.604-.2-.19-.413-.406-.602-.607M214.083 325.542L92.907 194.272 224.18 315.446c2.898 2.676 3.077 7.197.402 10.098-2.677 2.896-7.195 3.082-10.097.402-.136-.125-.277-.272-.402-.405M315.612 234.685L189.102 98.078 325.71 224.585c2.896 2.684 3.067 7.203.387 10.1-2.682 2.895-7.2 3.066-10.098.387-.13-.123-.268-.258-.388-.387M304.697 272.93L121.567 74.655l198.274 183.13c4.35 4.017 4.62 10.796.605 15.144-4.017 4.352-10.797 4.617-15.146.604-.205-.19-.418-.404-.603-.605M176.31 314.783l-57.647-62.695 62.692 57.65c1.453 1.334 1.547 3.596.215 5.045-1.338 1.453-3.598 1.55-5.05.215-.072-.07-.144-.143-.21-.215M311.093 189.297l-57.65-62.694 62.696 57.646c1.45 1.335 1.546 3.597.21 5.048-1.335 1.45-3.595 1.547-5.05.21-.07-.065-.143-.143-.207-.21" />
        </g>
      </svg>
      <form className="flex flex-col w-full gap-2 p-6 bg-white rounded-md shadow-md" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="mt-4">          
          <button className="w-full p-2 text-white bg-indigo-600 rounded-md" type="submit">
            Sign In
          </button>
          <Link to="/sign-up" className="block mt-2 text-sm text-center text-indigo-600">
            Don't have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
