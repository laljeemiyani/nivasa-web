import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ 
  className, 
  type = 'text', 
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  error,
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'input-default',
    filled: 'input-filled',
    outlined: 'input-outlined',
    underlined: 'input-underlined',
  };

  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  return (
    <div className="relative w-full">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          'input',
          variantClasses[variant],
          sizeClasses[size],
          icon && iconPosition === 'left' && 'pl-10',
          icon && iconPosition === 'right' && 'pr-10',
          error && 'input-error',
          className
        )}
        ref={ref}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
