import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void; 
  type?: "submit" | "reset" | "button";
  className: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type, className }) => {
  console.log(`button-${className}`);
    
  return (
    <button
      type={type}
      className={`button-${className}`}
      onClick={onClick}
       >
      {label}
    </button>
  );
};

export default Button;
