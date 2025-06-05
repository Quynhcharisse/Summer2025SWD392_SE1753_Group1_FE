import React from "react";

const LockIcon = ({ size = 20, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="4" y="8" width="12" height="8" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M7 8V6a3 3 0 1 1 6 0v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="12" r="1" fill={color} />
  </svg>
);

export default LockIcon;
