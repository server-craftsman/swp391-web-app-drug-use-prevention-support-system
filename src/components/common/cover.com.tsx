import React from 'react';
import { Link } from 'react-router-dom';
import BrainScan from "../../assets/brain-scan.jpg";

interface CoverProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

const Cover: React.FC<CoverProps> = ({
  title = "Viện Quốc Gia về Phòng Ngừa Ma Túy",
  subtitle = "Hỗ trợ nghiên cứu khoa học về sử dụng ma túy và nghiện",
  buttonText = "Xem nghiên cứu về sử dụng chất gây nghiện",
  buttonLink = "/research",
  imageUrl = BrainScan, // Placeholder for your brain image
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              {subtitle}
            </p>
            <Link
              to={buttonLink}
              className="inline-block bg-primary hover:bg-[#0056b3] text-white font-medium py-3 px-6 rounded transition-all duration-300 hover:shadow-lg active:scale-98"
            >
              {buttonText}
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg h-64 md:h-80 lg:h-96">
              <img
                src={imageUrl}
                alt="Brain scan visualization"
                className="w-full h-full object-contain animate-pulse-subtle"
              />
              
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-green-400 to-purple-500 opacity-20 blur-xl rounded-lg animate-slow-spin"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-500 opacity-10 blur-xl rounded-lg animate-slow-spin-reverse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gray-50">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 70" 
          className="w-full h-full"
        >
          <path 
            fill="#FFFFFF" 
            fillOpacity="1" 
            d="M0,32L60,42.7C120,53,240,75,360,69.3C480,64,600,32,720,21.3C840,11,960,21,1080,26.7C1200,32,1320,32,1380,32L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

// const globalStyles = `
// @keyframes pulse-subtle {
//   0%, 100% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.02);
//   }
// }

// @keyframes slow-spin {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(360deg);
//   }
// }

// @keyframes slow-spin-reverse {
//   0% {
//     transform: rotate(0deg);
//   }
//   100% {
//     transform: rotate(-360deg);
//   }
// }

// .animate-pulse-subtle {
//   animation: pulse-subtle 10s infinite ease-in-out;
// }

// .animate-slow-spin {
//   animation: slow-spin 60s infinite linear;
// }

// .animate-slow-spin-reverse {
//   animation: slow-spin-reverse 50s infinite linear;
// }

// .active\:scale-98:active {
//   transform: scale(0.98);
// }
// `;

export default Cover;
