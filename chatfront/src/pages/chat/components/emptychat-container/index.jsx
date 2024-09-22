import { animationdefaultoptions } from '@/lib/utils';
import Lottie from 'react-lottie';

const EmptyChatContainer = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-black transition-all duration-1000">
      <div className="flex items-center justify-center gap-4">
        <Lottie
          isClickToPauseDisabled={true}
          height={80}
          width={80}
          options={animationdefaultoptions}
        />
        <div className="ml-4 text-center text-white text-opacity-80 transition-all duration-300">
          <h3 className="text-lg lg:text-2xl font-medium">
            Hi<span className="text-purple-500">!</span> Welcome to
            <span className="text-purple-500"> Parth's</span> CHATAPP
            <span className="text-purple-500">.</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
