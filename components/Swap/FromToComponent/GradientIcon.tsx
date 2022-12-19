import React from "react";

const GradientIcon: React.FC = () => {
  return (
    <svg width="0" height="0">
      <linearGradient id="wynd-gradient" x1="100%" y1="0" x2="0%" y2="100%">
        <stop stopColor="#389270" offset="0%" />
        <stop stopColor="#0E67AA" offset="100%" />
      </linearGradient>
    </svg>
  );
};

export default GradientIcon;
