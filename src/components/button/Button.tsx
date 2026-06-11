import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`size-${size}`]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
