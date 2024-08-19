import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlineMailOutline } from "react-icons/md";
import { VscLockSmall } from "react-icons/vsc";
import { TbEyeClosed } from "react-icons/tb";
import { RiEyeCloseFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import api from '../../api';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
    setPasswordError("");
    setEmailError("");
  };

  const handleSignUp = async () => {
    setError("");
    setPasswordError("");
    setEmailError("");
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters");
      return;
    }
  
    try {
      const response = await api.post('/api/auth/signup', { 
        email, 
        password, 
        confirmPassword, 
        username, 
        firstName 
      });
  
      if (response.status === 201) {
        setShowSuccessAlert(true);
        resetForm();
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message.includes("Email already registered")) {
          setEmailError("The email address is already in use. Please proceed to login.");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    }
  };

  const SuccessAlert = () => (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-3 rounded-md border-l-4 border-green-500 bg-green-50 max-w-2xl mx-auto shadow-lg z-50">
      <div className="flex justify-between">
        <div className="flex">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 rounded-full text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="self-center ml-3">
            <span className="text-green-600 font-semibold">Success</span>
            <p className="text-green-600 mt-1">
              Account has been created successfully. Please check your email to verify your account.
            </p>
          </div>
        </div>
        <button
          className="self-start text-green-500"
          onClick={() => setShowSuccessAlert(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center font-urbanist justify-center bg-gray-200 relative">
      {showSuccessAlert && <SuccessAlert />}
      <div className="bg-gray-100 p-8 rounded-lg max-w-4xl w-full flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6">
          <h2 className="text-4xl font-semibold text-green-800 text-center mb-24">
            Create Account
          </h2>
          <form className="relative">
            <div className="mb-8 relative">
              <label
                className="absolute -top-3 left-6 bg-gray-100 px-1 text-gray-700 text-sm font-semibold"
                htmlFor="username"
              >
                Username
              </label>
              <div className="flex items-center shadow appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <CgProfile className="text-gray-500 mr-3" />
                <input
                  className="flex-1 bg-transparent focus:outline-none"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-8 relative">
              <label
                className="absolute -top-3 left-6 bg-gray-100 px-1 text-gray-700 text-sm font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex items-center shadow appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <MdOutlineMailOutline className="text-gray-500 mr-3" />
                <input
                  className="flex-1 bg-transparent focus:outline-none"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-8 relative">
              <label
                className="absolute -top-3 left-6 bg-gray-100 px-1 text-gray-700 text-sm font-semibold"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center shadow appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <VscLockSmall className="text-gray-500 mr-3" />
                <input
                  className="flex-1 bg-transparent focus:outline-none"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="focus:outline-none ml-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <TbEyeClosed className="text-gray-500" />
                  ) : (
                    <RiEyeCloseFill className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="mb-8 relative">
              <label
                className="absolute -top-3 left-6 bg-gray-100 px-1 text-gray-700 text-sm font-semibold"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="flex items-center shadow appearance-none border rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <VscLockSmall className="text-gray-500 mr-3" />
                <input
                  className="flex-1 bg-transparent focus:outline-none"
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="focus:outline-none ml-3"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <TbEyeClosed className="text-gray-500" />
                  ) : (
                    <RiEyeCloseFill className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {passwordError && (
              <p className="text-red-700 font-semibold text-center mb-4">
                {passwordError}
              </p>
            )}
            {emailError && (
              <p className="text-red-700 font-semibold text-center mb-4">
                {emailError}
              </p>
            )}
            {error && (
              <p className="text-red-700 font-semibold text-center mb-4">
                {error}
              </p>
            )}
            <button
              className="w-full bg-green-800 text-gray-50 font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSignUp}
            >
              Create Account
            </button>
          </form>
          <p className="mt-4 font-semibold text-center">
      Already have an account?{" "}
      <Link to="/login" className="text-green-800">
        Sign in
      </Link>
    </p>
    <p className="mt-2 font-semibold text-center">
      <Link to="/" className="text-green-800">
        Back to Homepage
      </Link>
    </p>
        </div>
        <div className="w-full md:w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
            alt="Sample Food"
            className="object-cover h-full w-full rounded-l-lg md:rounded-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
