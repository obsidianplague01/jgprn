import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useSplitTextReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;

    const words = ref.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      }
    );
  }, [ref]);
}
