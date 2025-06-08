import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen backdrop-blur-sm">
      <div className="p-1">
        <DotLottieReact
          src="https://lottie.host/820b9650-929d-48e4-88f8-9eb3ef18eddb/sWzRIbqGz8.lottie"
          loop
          autoplay
          style={{ opacity: 0.5 }}
        />
      </div>
    </div>
  )
}

export default Loading;
