import React, { use, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { AuthContext } from "../Authentication/AuthContext";
import { useLocation, useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eye, setEye] = useState(false);
  const { GoogleSignIN, SignInUser } = use(AuthContext);

  const axiosSecure = useAxiosSecure();

  const HandleLogIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    SignInUser(email, password)
      .then(() => {
        toast.success("Login Success");
        // console.log(result.user);
        setTimeout(() => {
          navigate(location.state || "/");
        }, 1000);
      })
      .catch((error) => {
        // console.log(error);
        if (
          error == "FirebaseError: Firebase: Error (auth/invalid-credential)."
        )
          toast.error("invalid credential");
        else toast.error(error.message);
      });
    e.target.password.value = "";
  };

  const HandleGoogleLogIn = () => {
    GoogleSignIN()
      .then((result) => {
        // console.log(result.user);
        //============ send user to DB ===============
        const user = result.user;
        const newUser = {
          name: user.displayName,
          email: user.email,
          photoUrl:
            user.photoURL ||
            `https://placehold.co/150x150/4F46E5/FFFFFF?text=${user.displayName
              .slice(0, 2)
              .toUpperCase()}`,
        };
        axiosSecure.post("/users", newUser).then((data) => {
          // console.log(data.data);
        });
        setTimeout(() => {
          navigate(location.state || "/");
        }, 1000);
      })
      .catch((error) => {
        // console.log(error);
        if (error) toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-black">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl border-t-4 border-indigo-600 space-y-4 dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome To StyleDecor
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Decorate your dream as heaven
          </p>
        </div>

        <form className="space-y-3 " onSubmit={HandleLogIn}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                // ref={emailRef}
                placeholder="you@example.com"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={eye ? "text" : "password"}
                placeholder="*********"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
              />
              <div
                className="absolute top-3 right-2"
                onClick={() => setEye(!eye)}
              >
                {!eye ? <IoEye /> : <IoMdEyeOff />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <h1
                className="font-medium text-indigo-600 hover:text-blue-700 hover:underline dark:text-white"
                // onClick={HandleReset}
              >
                Forgot your password?
              </h1>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Log In
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-400 h-px"></div>
          <div>or</div>
          <div className="w-full bg-gray-400 h-px"></div>
        </div>

        <div>
          <button
            className="btn border-[#e5e5e5] w-full rounded-lg bg-black text-white hover:text-yellow-400"
            onClick={HandleGoogleLogIn}
          >
            <FaGoogle />
            Sign In with Google
          </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 dark:text-white"
            >
              Register Now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
