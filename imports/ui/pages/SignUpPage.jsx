import React, {useEffect, useState} from "react";
import { Accounts } from "meteor/accounts-base";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const user = {
      profile: {
        name,
      },
      username,
      password,
    };

    Accounts.createUserAsync(user)
      .then(() => {
        setName("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setError("");

        // Redirect to the sign in page
        alert("Account created successfully");
        navigate("/sign-in");
      })
      .catch((error) => {
        console.log(error);
        setError(error.reason);
      });
  };

  useEffect(() => {
    // if user is already logged in, redirect to dashboard
    if (Meteor.userId()) {
      navigate("/dashboard");
    }
  })

  return (
    <div className="flex flex-col items-center justify-center max-w-md min-h-dvh gap-5 mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full gap-2 p-8 bg-white rounded-md shadow-md"
      >
        <div className="space-y-2 mb-8 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <img
                src="/icon-512-maskable.png"
                alt="Linkly Logo"
                className="w-6 h-6 rounded" />
            <h4 className="text-xl font-bold text-blue-500 text-center">Linkly</h4>
          </div>
          <h3 className="text-4xl text-gray-700 text-center">Create Account</h3>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm">
            Confirm Password
          </label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            type="password"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="mt-4">
          <button
            className="w-full p-2 text-white bg-blue-600 rounded-md"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
