import { useTyping } from '../context/TypingContext';
export const TargetCode = ({
  code
}: {
  code: string;
}) => {
  const {
    typedText,
    currentIndex
  } = useTyping();
  return <div className="bg-card rounded-lg border border-border p-4 h-full overflow-auto">
    <pre className="font-mono text-sm whitespace-pre-wrap">
      {code.split('').map((char, index) => {
        let className = 'transition-colors duration-100 ';
        // Character styling based on typing status
        if (index < typedText.length) {
          className += typedText[index] === char ? 'text-green-400' : 'text-red-500 bg-red-900 bg-opacity-40';
        }
        // Current character highlight
        if (index === currentIndex) {
          className += ' border-b-2 border-primary';
        }
        return <span key={index} className={className}>
          {char}
        </span>;
      })}
    </pre>
  </div>;
};