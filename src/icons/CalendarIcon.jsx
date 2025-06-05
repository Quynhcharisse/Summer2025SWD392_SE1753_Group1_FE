import React from "react";

const CalendarIcon = ({ size = 20, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="4" width="14" height="13" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M7 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 9H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default CalendarIcon;
