import React from 'react';
import { Link } from 'react-router-dom';

interface CoverProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  secondButtonText?: string;
  secondButtonLink?: string;
}

const Cover: React.FC<CoverProps> = ({
  title = "Hệ thống phòng chống",
  subtitle = "Ma túy thông minh",
  buttonText = "Khám phá hệ thống",
  buttonLink = "/system",
  secondButtonText = "Báo cáo sự cố",
  secondButtonLink = "/report",
}) => {
  return (
    <>
      <style>
        {`
          @keyframes hyperspeed {
            0% {
              transform: translateX(-100%) translateY(-50%);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateX(100vw) translateY(-50%);
              opacity: 0;
            }
          }

          @keyframes neon-flow {
            0%, 100% {
              transform: translateX(-50%) scaleX(0.8);
              opacity: 0.6;
            }
            50% {
              transform: translateX(-50%) scaleX(1.2);
              opacity: 1;
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(32, 85, 138, 0.4);
            }
            50% {
              box-shadow: 0 0 40px rgba(32, 85, 138, 0.8);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .hyperspeed-line {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, transparent, #20558A, #153759, transparent);
            animation: hyperspeed 3s linear infinite;
          }

          .neon-flow {
            animation: neon-flow 4s ease-in-out infinite;
          }

          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }

          .float-animation {
            animation: float 6s ease-in-out infinite;
          }

          .gradient-text {
            background: linear-gradient(135deg, #20558A 0%, #153759 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .neon-border {
            border: 1px solid rgba(32, 85, 138, 0.3);
            box-shadow: 0 0 20px rgba(32, 85, 138, 0.2);
          }

          .neon-button {
            background: linear-gradient(135deg, rgba(32, 85, 138, 0.1), rgba(21, 55, 89, 0.1));
            border: 1px solid rgba(32, 85, 138, 0.3);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .neon-button:hover {
            background: linear-gradient(135deg, rgba(32, 85, 138, 0.2), rgba(21, 55, 89, 0.2));
            box-shadow: 0 0 30px rgba(32, 85, 138, 0.4);
            transform: translateY(-2px);
          }

          .secondary-button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .secondary-button:hover {
            background: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
        `}
      </style>

      <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#222222] via-[#000000] to-[#000000] flex items-center justify-center ml-[calc(-50vw+50%)]">
        {/* Hyperspeed Animation Lines */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="hyperspeed-line"
            style={{
              top: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 200}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Main Neon Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blue Warning Line */}
          <div
            className="absolute bottom-1/3 left-0 w-full h-1 neon-flow"
            style={{
              background: 'linear-gradient(90deg, transparent, #20558A, #153759, transparent)',
              transform: 'translateX(-50%) rotate(-5deg)',
            }}
          />

          {/* Light Blue Alert Line */}
          <div
            className="absolute top-1/3 right-0 w-full h-1 neon-flow"
            style={{
              background: 'linear-gradient(90deg, transparent, #4A90E2, #20558A, transparent)',
              transform: 'translateX(50%) rotate(5deg)',
              animationDelay: '2s',
            }}
          />

          {/* Additional accent lines */}
          <div
            className="absolute top-1/2 left-1/4 w-1/2 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, #20558A, transparent)',
              transform: 'rotate(-15deg)',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-1/3 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, #4A90E2, transparent)',
              transform: 'rotate(10deg)',
            }}
          />
        </div>

        {/* Content Container */}
        <div className="max-w-[1000px] w-full h-full flex items-center justify-center relative z-10 px-6">
          <div className="text-center max-w-4xl">
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 float-animation">
              {title}{' '}
              <span className="gradient-text block md:inline">
                {subtitle}
              </span>
            </h1>

            {/* Subtitle/Description */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              Bảo vệ cộng đồng khỏi tệ nạn xã hội với công nghệ giám sát hiện đại và hệ thống cảnh báo thông minh
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to={buttonLink}
                className="neon-button text-white font-semibold py-4 px-8 rounded-lg hover:text-white transition-all duration-300 pulse-glow"
              >
                {buttonText}
              </Link>

              <Link
                to={secondButtonLink}
                className="secondary-button text-white font-semibold py-4 px-8 rounded-lg hover:text-white transition-all duration-300"
              >
                {secondButtonText}
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="relative">
              {/* Security symbols */}
              <div className="absolute -top-20 -left-20 w-32 h-32 border border-blue-500/30 rounded-full float-animation opacity-50"></div>
              <div className="absolute -bottom-10 -right-16 w-24 h-24 border border-[#20558A]/30 rotate-45 float-animation opacity-50" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-0 right-1/4 w-16 h-16 border border-blue-500/30 rounded-full float-animation opacity-30" style={{ animationDelay: '4s' }}></div>

              {/* Warning indicators */}
              <div className="absolute top-10 left-1/3 w-2 h-2 bg-[#20558A] rounded-full animate-pulse"></div>
              <div className="absolute bottom-8 left-1/4 w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#20558A] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white/60 cursor-pointer hover:text-white transition-colors duration-300">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
            <span className="text-sm mt-2">Tìm hiểu thêm</span>
          </div>
        </div>

        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </section>
    </>
  );
};

export default Cover;
