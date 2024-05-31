import React, { useEffect } from "react";

const preventDefault = (e) => e.preventDefault();

const PreventBackgroundScroll = ({}) => {
  useEffect(() => {
    window.addEventListener("touchmove", preventDefault, {
      passive: false,
    });

    return () => window.removeEventListener("touchmove", preventDefault);
  });

  // Remember to clean up when removing it
};

export default PreventBackgroundScroll;
