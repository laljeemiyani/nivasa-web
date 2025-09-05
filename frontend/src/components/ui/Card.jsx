import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Card = forwardRef(({ 
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

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 p-6 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-text-secondary/80', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
