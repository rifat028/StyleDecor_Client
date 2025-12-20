import { motion } from "framer-motion";
import { Link } from "react-router";
import Hero from "../../assets/Hero.png";

const Banner = () => {
  return (
    <section className="px-2 md:px-10">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Background Image */}
        <img
          src={Hero}
          className="w-full h-55 sm:h-70 md:h-95 lg:h-115 object-cover"
        />

        {/* Left Text Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-2 text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-[50vw] bg-linear-to-r from-gray-50 to-blue-50 bg-clip-text text-transparent"
            >
              Bringing Your Vision to Life with Expert Decor
              <span className="text-green-400"></span>{" "}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-3 md:mt-4 text-xs sm:text-sm md:text-lg max-w-[50vw] bg-linear-to-r from-blue-200 to-gray-50 bg-clip-text text-transparent"
            >
              Book trusted decorators, choose a time slot, pay securely, and
              track your project status—everything in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-5 md:mt-7 flex flex-wrap gap-3"
            >
              <Link to="/services">
                <button
                  className="
                      bg-yellow-400 hover:bg-yellow-500
                      text-black font-semibold
                      px-4 py-2 md:px-6 md:py-3
                      rounded-2xl shadow-lg
                      transform transition duration-300
                      hover:scale-101
                      text-xs sm:text-sm md:text-base
                    "
                >
                  Book Decoration Service →
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
