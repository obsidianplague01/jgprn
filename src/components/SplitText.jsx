import { useRef } from "react";
import useSplitTextReveal from './utilities/useSplitTextReveal';

export default function SplitText({ text, className = "" }) {
  const ref = useRef(null);
  useSplitTextReveal(ref);

  return (
    <h1 ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-2">
          <span className="word inline-block">{word}</span>
        </span>
      ))}
    </h1>
  );
}
