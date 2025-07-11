import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
  const text = "Phòng chống Ma túy...";

  return (
    <div
      style={{
        zIndex: 2147483647,
        position: 'fixed',
      }}
      className="fixed inset-0 h-screen w-full flex flex-col justify-center items-center backdrop-blur-sm bg-white/50"
    >
      <DotLottieReact
        src="https://lottie.host/820b9650-929d-48e4-88f8-9eb3ef18eddb/sWzRIbqGz8.lottie"
        loop
        autoplay
        style={{ opacity: 0.8, width: '300px', height: '300px' }}
      />
      {/* Animated text */}
      <div className="text-center mt-4">
        <h1
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: '#20558A',
            letterSpacing: '1px'
          }}
        >
          {text.split('').map((char, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                animation: `charFadeIn 0.8s ease-in-out ${index * 0.01}s both`,
                opacity: 0
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
      </div>

      <style>{`
        @keyframes charFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-5px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default Loading;
