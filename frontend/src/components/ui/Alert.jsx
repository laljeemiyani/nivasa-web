import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Alert = forwardRef(({ 
  className, 
  variant = 'default',
  title,
  children,
  icon,
  onClose,
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'alert-default',
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'alert',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && (
        <div className="alert-icon">
          {icon}
        </div>
      )}
      <div className="alert-content">
        {title && (
          <h5 className="alert-title">{title}</h5>
        )}
        <div className="alert-description">
          {children}
        </div>
      </div>
      {onClose && (
        <button 
          type="button" 
          className="alert-close" 
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';

export default Alert;