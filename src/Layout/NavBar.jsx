import React, { use } from "react";
import logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";
import toast, { Toaster } from "react-hot-toast";
// import { Tooltip } from "react-tooltip";
import { ScaleLoader } from "react-spinners";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOutUser, loading } = use(AuthContext);
  //   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // console.log(user, user.photoURL);

  const links = (
    <>
      <li className="font-bold">
        <NavLink to="/">Home</NavLink>
      </li>
      <li className="font-bold">
        <NavLink to="/services">Services</NavLink>
      </li>
      <li className="font-bold">
        <NavLink to="/about">About</NavLink>
      </li>
      <li className="font-bold">
        <NavLink to="/contact">Contact</NavLink>
      </li>
      {/* <li className="font-bold">
        <NavLink to={user ? `/my-books?userEmail=${user.email}` : `/my-books`}>
          My Books
        </NavLink>
      </li> */}
    </>
  );

  const HandleLogOut = () => {
    logOutUser()
      .then(() => toast.success("Sign Out Successful"))
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-10"
          >
            {links}
          </ul>
        </div>
        <a href="/">
          <div className="flex items-center justify-between btn btn-ghost text-4xl font-bold">
            <div>
              <img
                className="rounded-full h-10 border-2 border-blue-500"
                src={logo}
                alt=""
              />
            </div>
            <div className="hidden md:block text-blue-700 mb-1">StyleDecor</div>
          </div>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      {user && loading ? (
        <div className="navbar-end flex gap-4">
          <ScaleLoader color={"#7C3AED"} />
        </div>
      ) : user ? (
        <div className="navbar-end flex gap-4">
          {/* <input
            type="checkbox"
            defaultChecked={theme == "dark"}
            onChange={HandleTheme}
            value="synthwave"
            className="toggle"
          /> */}
          <button
            onClick={HandleLogOut}
            className=" bg-indigo-600 hover:bg-indigo-700 text-white font-bold 
                       py-2 px-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            Log Out
          </button>
          <div
            className="ring-2 ring-blue-500 rounded-full border-gray-100 border-2"
            // data-tooltip-id="profile-name-tooltip"
            // data-tooltip-content={user.displayName}
            // data-tooltip-place="right"
          >
            <img src={user.photoURL} className="rounded-full h-8" />
          </div>
        </div>
      ) : (
        <div className="navbar-end flex gap-4">
          {/* <input
            type="checkbox"
            defaultChecked={theme == "dark"}
            onChange={HandleTheme}
            value="synthwave"
            className="toggle"
          /> */}
          <button
            onClick={() => navigate("/login")}
            className=" bg-indigo-600 hover:bg-indigo-700 text-white font-bold 
                       py-2 px-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            LogIn
          </button>
          <button
            onClick={() => navigate("/register")}
            className=" bg-indigo-600 hover:bg-indigo-700 text-white font-bold hidden md:block
                       py-2 px-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
