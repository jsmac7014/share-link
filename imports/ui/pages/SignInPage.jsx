import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
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
        navigate("/dashboard");
      }
    });
  };

  useEffect(() => {
    // if user is already logged in, redirect to dashboard
    if (Meteor.userId()) {
      navigate("/dashboard");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center max-w-md min-h-dvh gap-5 mx-auto p-4">
      <form
        className="flex flex-col w-full gap-2 p-8 bg-white rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2 mb-8 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <img src="/icon-512-maskable.png" alt="Linkly Logo" className="w-6 h-6 rounded" />
            <h4 className="text-xl font-bold text-blue-500 text-center">Linkly</h4>
          </div>
          <h3 className="text-4xl text-gray-700 text-center">Welcome Back</h3>
        </div>
        <div>
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            type="text"
            className="w-full p-2 mt-2 border  border-gray-200 rounded-lg bg-gray-50"
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
            className="w-full p-2 mt-2 border  border-gray-200 rounded-lg bg-gray-50"
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="mt-4">
          <button className="w-full p-2 text-white bg-blue-600 rounded-lg" type="submit">
            Sign In
          </button>
          <Link to="/sign-up" className="block mt-2 text-sm text-center text-blue-600">
            Don't have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
