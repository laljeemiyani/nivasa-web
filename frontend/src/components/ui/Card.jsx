import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = forwardRef(({ 
  className, 
  variant = 'default',
  hover = false,
  glassmorphism = false,
  bordered = false,
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'card-default',
    primary: 'card-primary',
    secondary: 'card-secondary',
    gradient: 'card-gradient',
    dark: 'card-dark',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'card', 
        variantClasses[variant],
        hover && 'card-hover',
        glassmorphism && 'card-glass',
        bordered && 'card-bordered',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-6 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary/80', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
