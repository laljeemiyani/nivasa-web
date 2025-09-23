import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Badge = forwardRef(({ 
  className, 
  variant = 'default',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  glow = false,
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'badge-default',
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    outline: 'badge-outline',
  };

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <span
      ref={ref}
      className={cn(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        glow && 'badge-glow',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-1">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-1">{icon}</span>
      )}
    </span>
  );
});

export default Badge;
