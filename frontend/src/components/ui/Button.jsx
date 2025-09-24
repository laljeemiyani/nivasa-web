import {forwardRef} from 'react';
import {cn} from '../../utils/cn';

export const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled,
  loading,
  icon,
  iconPosition = 'left',
  glow = false,
                                    spanClasses = '',
  ...props 
}, ref) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    gradient: 'btn-gradient',
    danger: 'btn-danger',
    success: 'btn-success',
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };
  
  const glowEffect = glow ? 'btn-glow' : '';

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glowEffect,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      <span className={cn(
          'transition-transform duration-300', spanClasses,
        variant === 'gradient' && 'mix-blend-plus-lighter'
      )}>
        {children}
      </span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
