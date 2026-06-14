import React from 'react';

const AuthLayout = ({ children, illustration = true, title, subtitle }) => {
  return (
    <div className="min-h-screen flex w-full animate-fade-in">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-lighter-main to-white items-center justify-center p-12">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-main flex items-center justify-center text-white font-bold text-xl">
            <span className="text-white text-sm">Edu</span>
          </div>
          <span className="text-xl font-bold text-dark-blue">EduVerse</span>
        </div>
        
        <div className="max-w-md w-full flex flex-col items-center text-center">
          {illustration ? (
            <div className="mb-8 w-full max-w-sm">
              {/* Premium geometric layout placeholder with nice gradients */}
              <div className="w-full h-64 bg-gradient-to-br from-main/20 to-main/5 rounded-2xl overflow-hidden relative border border-main/10 flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full bg-main/10 -top-8 -left-8 animate-pulse" />
                <div className="absolute w-24 h-24 rounded-full bg-main/5 -bottom-6 -right-6" />
                <div className="relative text-main font-bold text-lg tracking-wider flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-main flex items-center justify-center shadow-lg shadow-main/30 text-white text-3xl">E</div>
                  <span>EDUVERSE</span>
                </div>
              </div>
            </div>
          ) : null}
          
          <h2 className="text-2xl font-bold text-dark-blue mb-4">
            {title || "Your Academic Universe in One Place"}
          </h2>
          <p className="text-gray-text">
            {subtitle || "Join thousands of students and educators in managing their academic journey with a seamless experience."}
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8 sm:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
