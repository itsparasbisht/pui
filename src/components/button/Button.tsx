import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  size = "md",
  variant = "primary",
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`size-${size}`]} ${styles[`variant-${variant}`]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
