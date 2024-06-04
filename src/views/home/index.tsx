import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { play } from '../../player/play';

export const Home = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationFinished(true);
    }, 3000); // Adjust animation duration as needed

    return () => clearTimeout(timeout);
  }, []);

  const next = () => {
    play();
    navigate('/main');
    localStorage.clear();
  };

  return (
    <div className="container flex flex-col items-center justify-center h-screen">
      <div className={`animated-title text-center ${animationFinished ? 'revealed' : ''}`}>
        <div className="text-top border-b-4 border-black">
          <div className="h-1/2 overflow-hidden relative">
            <div className="font-roboto text-7xl md:text-9xl animate-showTopText animation-delay-2000 text-start">
              <span className="text-gray-700">Practice</span><br />
              <span className="text-gray-700">Math skills</span>
            </div>
          </div>
        </div>
        <div className="text-bottom">
          <div className={`${animationFinished ? 'text-start pl-2 opacity-1 animate-showBottomText animation-delay-2000 text-2xl md:text-3xl' : 'opacity-0'}`}>
            <span>with </span>
            <span>MMS</span>
          </div>
        </div>
        <div className={`h_btn_place flex mt-4 ${animationFinished ? 'transition-opacity duration-500 opacity-100' : 'transition-opacity duration-500 opacity-0'}`}>
          <button onClick={next} className={`animated-button-advanced bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full mt-8 opacity-100 transition-opacity duration-1000 transform-gpu translate-y-0 sm:translate-y-0 animate-bounce animate-infinite animate-duration-[2000ms] animate-ease-linear`}>
            Let's Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
