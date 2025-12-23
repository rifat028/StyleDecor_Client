import React, { use, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { AuthContext } from "../Authentication/AuthContext";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Register = () => {
  const { CreateUserWithEmail, updateProfileInfo, GoogleSignIN } =
    use(AuthContext);
  const navigate = useNavigate();

  const axiosSecure = useAxiosSecure();

  const [eye, setEye] = useState(false);
  const [error, setError] = useState("");

  const passwordUpperCase = /(?=.*[A-Z])/;
  const passwordLowerCase = /(?=.*[a-z])/;

  const HandleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoUrl = e.target.photoUrl.value;
    // console.log(name, email, photoUrl, password);

    const newUser = {
      name,
      email,
      photoUrl:
        photoUrl ||
        `https://placehold.co/150x150/4F46E5/FFFFFF?text=${name
          .slice(0, 2)
          .toUpperCase()}`,
    };

    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 character long");
      return;
    }
    if (!passwordUpperCase.test(password)) {
      setError("Must have an Uppercase letter in the password");
      return;
    }
    if (!passwordLowerCase.test(password)) {
      setError("Must have a Lowercase letter in the password");
      return;
    }

    CreateUserWithEmail(email, password)
      .then(() => {
        toast.success("Account Created...!");
        updateProfileInfo(name, photoUrl)
          .then(() => {
            toast.success("User info updated...!");
            //============ send user to DB ===============
            axiosSecure.post("/users", newUser).then((data) => {
              // console.log(data.data.insertedId);
            });
            setTimeout(() => {
              navigate("/");
            }, 1000);
          })
          .catch(() => {
            toast.error("User info couldn't updated...!");
          });
      })
      .catch((error) => {
        if (error.message == "Firebase: Error (auth/email-already-in-use).")
          toast.error("Email Already in Use...!");
        else toast.error(error.message);
      });
    e.target.reset;
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
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        // console.log(error);
        if (error) toast.error(error.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-black">
      <Toaster position="top-center" reverseOrder={false} className="z-10" />
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl border-t-4 border-indigo-600 space-y-3 dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us and start decorating your dream
          </p>
        </div>

        <form className="space-y-3" onSubmit={HandleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                name="name"
                type="text"
                placeholder="Your name Here"
                required
                className=" dark:bg-gray-700 appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address<span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className=" dark:bg-gray-700 appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Photo URL
            </label>
            <div className="mt-1">
              <input
                name="photoUrl"
                type="photoUrl"
                placeholder="URL of The Photo Here"
                className=" dark:bg-gray-700 appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <input
                name="password"
                type={eye ? "text" : "password"}
                placeholder="Create a strong password"
                required
                className=" dark:bg-gray-700 appearance-none block w-full px-3 py-2 border border-gray-500 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
              <div
                className="absolute top-3 right-2"
                onClick={() => setEye(!eye)}
              >
                {!eye ? <IoEye /> : <IoMdEyeOff />}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 font-semibold text-sm">{error}</div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150"
            >
              Register
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

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <a
              href="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 dark:text-white"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
