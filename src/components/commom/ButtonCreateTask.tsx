import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...rest
}) => {
  const baseStyles = `
    px-4 py-2 
    rounded-xl 
    shadow-sm 
    text-sm 
    font-medium 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2
  `;

  const variants = {
    primary: "border-transparent border-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 bg-blue-600",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    danger: "border border-red-600 text-white hover:bg-red-700 focus:ring-red-500 bg-red-600",
  };

  return (
    <button
      {...rest}
      className={twMerge(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
};
