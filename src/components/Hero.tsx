import { useTyping } from '../context/TypingContext';
export const Hero = () => {
  const {
    scrollToTypingSection
  } = useTyping();
  return <section className="w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
      Type DSA, Code Faster.
    </h1>
    <p className="text-xl text-gray-400 max-w-2xl mb-8">
      Practice your typing with real Java DSA algorithms. Improve your coding
      speed and revise algorithms at the same time.
    </p>
    <button onClick={scrollToTypingSection} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 transform hover:scale-105">
      Start with an Easy Algorithm
    </button>
  </section>;
};