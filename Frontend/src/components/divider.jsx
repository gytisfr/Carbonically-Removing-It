import { gsap } from "gsap/gsap-core";
import { useGSAP } from "@gsap/react";

const Divider = () => {

    
useGSAP(() => {
    const infoAnimation = gsap.timeline({ repeat: -1 });

    // Animate bars
    infoAnimation.fromTo(
      ".bar",
      { yPercent: 100 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.inOut",
      },
    );

    infoAnimation.fromTo(
      ".bar",
      { yPercent: 0, opacity: 1 },
      {
        yPercent: -100,
        duration: 1.5,
        stagger: 0.1,
        ease: "power3.inOut",
      },
      ">-1",
    );
  });

    return (
        <div className="w-full h-8 py-1.5 bg-black flex items-center justify-end px-10">

        <div
            id="bar-animation"
            className="flex items-center justify-center overflow-hidden h-full mr-4"
          >
            {Array.from({ length: 10 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="bar h-full w-[3px] opacity-0 mx-[3px] rotate-14 bg-carbonYellow"
                ></div>
              );
            })}
          </div>

        </div>
    )
}


export default Divider;