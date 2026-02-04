import React, { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

gsap.registerPlugin(MorphSVGPlugin);

const CloseBtn = ({
  startPathD,
  endPathD,
  duration = 1,
  ease = "none",
  startStroke = "red",
  endStroke = "rgb(247, 189, 248)",
  startStrokeWidth = 1.5,
  endStrokeWidth = 3,
  startFill = "none",
  endFill = "none",
  startOpacity = 0.7,
  endOpacity = 0.7,
}) => {
  const pathRef = useRef(null);
  const shapeTween = useRef(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const {isTheme} = useContext(ThemeContext)

  useEffect(() => {
    if (!pathRef.current) return;

    const target = pathRef.current;
    const origStartShape = startPathD;
    const origEndShape = endPathD;

    const startBezier = MorphSVGPlugin.stringToRawPath(origStartShape);
    const endBezier = MorphSVGPlugin.stringToRawPath(origEndShape);

    const [autoShapeIndex] = MorphSVGPlugin.equalizeSegmentQuantity(
      startBezier,
      endBezier,
      "auto"
    );

    setAutoIndex(Math.round(autoShapeIndex));

    if (shapeTween.current) shapeTween.current.kill();

    shapeTween.current = gsap.fromTo(
      target,
      { morphSVG: origStartShape,stroke:isTheme ? "#c0c0c0":"black" },
      {
        duration,
        ease,
        morphSVG: { shape: origEndShape, shapeIndex: autoShapeIndex },
        yoyo: true,
        repeat: -1,
        onRepeat: () => shapeTween.current.reverse(),
        onReverseComplete: () => shapeTween.current.play(),
      }
    );

    return () => {
      if (shapeTween.current) shapeTween.current.kill();
    };
  }, [startPathD, endPathD, duration, ease]);

  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 24 24"
      style={{  display: "block", margin: "0 auto" }}
    >
      <path
        ref={pathRef}
        d={startPathD}
        fill={startFill}
        stroke={startStroke}
        strokeWidth={startStrokeWidth}
        opacity={startOpacity}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
};

export default CloseBtn;
