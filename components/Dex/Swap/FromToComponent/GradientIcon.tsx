import React from "react";

interface IProps {
  id: string;
  gradient1: string;
  gradient2: string;
}

const GradientIcon: React.FC<IProps> = ({ id, gradient1, gradient2 }) => {
  return (
    <svg width="0" height="0">
      <linearGradient id={id} x1="100%" y1="0" x2="0%" y2="100%">
        <stop stopColor={gradient1} offset="0%" />
        <stop stopColor={gradient2} offset="100%" />
      </linearGradient>
    </svg>
  );
};

export default GradientIcon;
