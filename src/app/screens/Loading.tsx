import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        zIndex: 9999,
        position: 'fixed',
      }}
      className="fixed inset-0 h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50/30 via-white/30 to-indigo-50/30"
    >
      {/* Screen reader only text */}
      <span className="sr-only">Đang tải nội dung. Vui lòng chờ.</span>

      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-transparent to-indigo-500/2" />

      {/* Static background elements - no animation to reduce visual noise */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/3 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-400/3 rounded-full blur-xl" />
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-emerald-400/3 rounded-full blur-xl" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with subtle glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-2xl opacity-5" />
          <DotLottieReact
            src="https://lottie.host/820b9650-929d-48e4-88f8-9eb3ef18eddb/sWzRIbqGz8.lottie"
            loop
            autoplay
            style={{ width: '300px', height: '300px' }}
          />
        </div>
      </div>

      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  )
}

export default Loading;
