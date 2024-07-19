import React from "react";

interface ButtonProps {
  label: string;
  type: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type,
  onClick,
  disabled = false,
  className = "",
}) => {
  const buttonClass = type === "options" ? "listItem__options__button" : "input__button"
  return (
    <button
      className={`${buttonClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
