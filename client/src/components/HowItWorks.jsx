import React from 'react';
import searchImage from '../assets/images/search.png';
import compareImage from '../assets/images/compare.png';
import saveImage from '../assets/images/save.png';
import contactImage from '../assets/images/contact_estate.png';
import finalizeImage from '../assets/images/finalize.png';

const fallbackImg = 'https://via.placeholder.com/96';

const steps = [
  {
    title: 'Search',
    description: 'Start by browsing properties based on your preferences.',
    image: searchImage,
  },
  {
    title: 'Compare',
    description: 'Compare properties based on price, location, and features.',
    image: compareImage,
  },
  {
    title: 'Save Favorites',
    description: 'Save your favorite listings and come back to them later.',
    image: saveImage,
  },
  {
    title: 'Contact Owner',
    description: 'Reach out directly to the property owner via Gmail.',
    image: contactImage,
  },
  {
    title: 'Finalize Deal',
    description: 'Negotiate and close the deal easily through our platform.',
    image: finalizeImage,
  },
];

const HowItWorks = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Top Wave */}
      <div className="w-full -mb-2">
        <svg className="block w-full mt-16 h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#0f172a"
            d="M0,160L60,160C120,160,240,160,360,160C480,160,600,160,720,170.7C840,181,960,203,1080,192C1200,181,1320,139,1380,117.3L1440,96L1440,0L0,0Z"
          />
        </svg>
      </div>

      {/* Dark Section Between Waves and Main Content */}
      <div className="relative py-16 bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">The Process at a Glance</h2>
          <p className="text-lg text-white/80">Here's a quick overview of how our platform works and helps you find your perfect property.</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="relative py-32 bg-gradient-to-br from-[#131236] via-[#182e6b] to-[#14185e] text-white">
        {/* Glow Accent */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-20 blur-3xl rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg transition duration-500 transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Yellow card on hover */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition duration-500 z-0" />

                {/* Increased shadow effect on hover */}
                <div className="absolute inset-0 rounded-3xl bg-opacity-0 group-hover:bg-opacity-40 bg-yellow-400 blur-xl shadow-xl transition duration-300 z-0" />

                <div className="relative z-10 flex flex-col items-center">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-24 h-24 mb-6 object-contain"
                    onError={(e) => (e.currentTarget.src = fallbackImg)}
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-white/80 text-base">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="w-full -mt-2">
        <svg className="block w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#0f172a"
            d="M0,64L60,85.3C120,107,240,149,360,170.7C480,192,600,192,720,181.3C840,171,960,149,1080,138.7C1200,128,1320,128,1380,133.3L1440,138.7L1440,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default HowItWorks;
