import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, username, userRole, setUserRole, signInWithGoogle, signupWithEmail, loginWithEmail, logout } = useAuth();
  const navigate = useNavigate();

  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showSigninForm, setShowSigninForm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const handleToggleClick = () => {
    console.log("Toggle button clicked, calling toggleTheme");
    toggleTheme();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log("Attempting signup with:", signupUsername, signupEmail);
      await signupWithEmail(signupUsername, signupEmail, signupPassword);
      setSignupUsername("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setShowSignupForm(false);
      setShowRoleModal(true); // Show role selection after signup
    } catch (error) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting signin with email:", signinEmail);
      await loginWithEmail(signinEmail, signinPassword);
      setSigninEmail("");
      setSigninPassword("");
      setShowSigninForm(false);
    } catch (error) {
      console.error("Sign-in failed:", error.message);
      alert("Sign-in failed: " + error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      console.log("Attempting Google sign-in");
      await signInWithGoogle();
      setShowSignupForm(false);
      setShowSigninForm(false);
      setShowRoleModal(true); // Show role selection after Google sign-in
    } catch (error) {
      console.error("Google Sign-in failed:", error.message);
      alert("Google Sign-in failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out");
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    }
  };

  const handleRoleSelection = async (role) => {
    try {
      await setUserRole(role === "publisher" ? "publisher-pending" : "reader"); // Set pending for publisher
      setShowRoleModal(false);
    } catch (error) {
      console.error("Failed to set role:", error.message);
      alert("Failed to set role: " + error.message);
    }
  };

  return (
    <header
      className={`w-full sticky top-0 z-10 flex items-center justify-between px-6 py-4 shadow-lg ${
        theme === "dark" ? "bg-teal-950 bg-opacity-90" : "bg-teal-700 bg-opacity-90"
      }`}
    >
      <h1
        className={`text-3xl font-bold font-nunito ${
          theme === "dark" ? "text-gray-200" : "text-white"
        }`}
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        WEEBOS
      </h1>
      <div className="flex gap-4 items-center">
        {currentUser ? (
          <>
            <span className={`${theme === "dark" ? "text-gray-200" : "text-white"}`}>
              Welcome, {username || "User"}
            </span>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                theme === "light"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowSignupForm(true)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                theme === "light"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowSigninForm(true)}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                theme === "light"
                  ? "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sign In
            </button>
          </>
        )}
        <button
          onClick={handleToggleClick}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            theme === "light"
              ? "bg-teal-600 text-white hover:bg-teal-700"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      {/* Signup Form */}
      {showSignupForm && !currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <form
            onSubmit={handleSignup}
            className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
              theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <div className="mb-4">
              <label htmlFor="signupUsername" className="block mb-2">
                Username
              </label>
              <input
                id="signupUsername"
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="signupEmail" className="block mb-2">
                Email
              </label>
              <input
                id="signupEmail"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="signupPassword" className="block mb-2">
                Password
              </label>
              <input
                id="signupPassword"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  theme === "light"
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={handleGoogleSignin}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  theme === "light"
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Sign Up with Google
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowSignupForm(false)}
              className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-400 text-white hover:bg-gray-500"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSignupForm(false);
                setShowSigninForm(true);
              }}
              className={`mt-2 w-full text-sm ${
                theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
              }`}
            >
              Already have an account? Sign In
            </button>
          </form>
        </div>
      )}

      {/* Signin Form */}
      {showSigninForm && !currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <form
            onSubmit={handleSignin}
            className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
              theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Sign In</h2>
            <div className="mb-4">
              <label htmlFor="signinEmail" className="block mb-2">
                Email
              </label>
              <input
                id="signinEmail"
                type="email"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="signinPassword" className="block mb-2">
                Password
              </label>
              <input
                id="signinPassword"
                type="password"
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-900 border-gray-300"
                } border focus:outline-none focus:border-teal-500`}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  theme === "light"
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleGoogleSignin}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  theme === "light"
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Sign In with Google
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowSigninForm(false)}
              className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors duration-300 ${
                theme === "light"
                  ? "bg-gray-400 text-white hover:bg-gray-500"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSigninForm(false);
                setShowSignupForm(true);
              }}
              className={`mt-2 w-full text-sm ${
                theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
              }`}
            >
              Need an account? Sign Up
            </button>
          </form>
        </div>
      )}

      {/* Role Selection Modal */}
      {showRoleModal && currentUser && userRole === null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div
            className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
              theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Are you a Reader or Publisher?</h2>
            <button
              onClick={() => handleRoleSelection("reader")}
              className={`w-full px-4 py-2 rounded-lg mb-4 ${
                theme === "dark"
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
            >
              Reader
            </button>
            <button
              onClick={() => handleRoleSelection("publisher")}
              className={`w-full px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
            >
              Publisher
            </button>
          </div>
        </div>
      )}
    </header>
  );
}