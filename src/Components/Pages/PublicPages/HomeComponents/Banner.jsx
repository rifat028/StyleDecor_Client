import { motion } from "framer-motion";
import { Link } from "react-router";
import Hero from "../../../../assets/Hero.png";

// Banner function component displaying hero section with call-to-action
const Banner = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight mb-6 transition-colors">
              Bringing Your Vision to <br className="hidden sm:block" />
              <span className="text-purple-600 dark:text-purple-400">Life </span>
              with <span className="text-purple-600 dark:text-purple-400">Expert </span>
              Decor
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mb-8 leading-relaxed font-medium transition-colors">
              Book trusted decorators, choose a time slot, pay securely, and track your project status—everything in one place.
            </p>

            {/* Link sub-component navigating to services page */}
            <Link to="/services">
              <button
                className="
                  bg-yellow-400 hover:bg-yellow-500
                  text-gray-900 font-bold
                  px-8 py-3.5
                  rounded-xl shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50
                  transform transition-all duration-300
                  hover:-translate-y-1 active:translate-y-0
                "
              >
                Book Decoration Service →
              </button>
            </Link>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Subtle decorative glow behind the image */}
            <div className="absolute -inset-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-3xl blur-2xl transform rotate-3 transition-colors pointer-events-none"></div>
            
            <img
              src={Hero}
              alt="Decoration Setup"
              className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] object-cover rounded-[2rem] shadow-2xl border-4 border-white dark:border-gray-800 transition-colors"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;
