import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

interface LoadingSpinnerProps {
  duration?: number;
  onComplete?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  duration = 5000,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const { appSettings } = useStore();
  const isDarkMode = appSettings.darkMode;

 useEffect(() => {
   const startTime = Date.now();
   const fastDuration = duration / 2; // Adjust this factor as needed to speed up
   const interval = setInterval(() => {
     const newProgress = Math.min(((Date.now() - startTime) / fastDuration) * 100, 100);
     setProgress(newProgress);
 
     if (newProgress >= 100) {
       clearInterval(interval);
       onComplete?.();
     }
   }, 16); // Keep the refresh rate smooth
 
   return () => clearInterval(interval);
 }, [duration, onComplete]);
 

  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-32 h-32 relative">
        <img
          src={  "https://i.postimg.cc/Pf3fQff6/logo-for-light-bg.png"}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      
      </div>
      <div className={`text-2xl font-semibold ${  'text-gray-900'}`}>
        Loading...
      </div>
      <div className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingSpinner;
