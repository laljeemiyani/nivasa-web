import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt = '', 
  size = 'md',
  status,
  statusPosition = 'bottom-right',
  fallback,
  bordered = false,
  ...props 
}, ref) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl',
  };

  const statusClasses = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    busy: 'bg-error',
    away: 'bg-warning',
  };

  const statusPositionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  const renderFallback = () => {
    if (typeof fallback === 'string') {
      return (
        <span className="flex h-full w-full items-center justify-center font-medium">
          {fallback.charAt(0).toUpperCase()}
        </span>
      );
    }
    return fallback;
  };

  return (
    <div className="relative inline-block">
      <div
        ref={ref}
        className={cn(
          'avatar relative flex shrink-0 overflow-hidden rounded-full bg-gray-100',
          sizeClasses[size],
          bordered && 'ring-2 ring-white ring-offset-2 ring-offset-background',
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          renderFallback()
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute block h-2.5 w-2.5 rounded-full ring-2 ring-white',
            statusClasses[status],
            statusPositionClasses[statusPosition]
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;