import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button.jsx';

export const AlertDialog = ({ children, open, onOpenChange, ...props }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="alert-dialog-container" {...props}>
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'alert-dialog-content relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl',
      'animate-in fade-in-0 zoom-in-95 duration-300',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export const AlertDialogHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('alert-dialog-header mb-4 flex flex-col space-y-1.5', className)}
    {...props}
  />
));

export const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('alert-dialog-title text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

export const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('alert-dialog-description text-sm text-gray-500', className)}
    {...props}
  />
));

export const AlertDialogFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('alert-dialog-footer flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
));

export const AlertDialogAction = forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn('alert-dialog-action', className)}
    {...props}
  />
));

export const AlertDialogCancel = forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    className={cn('alert-dialog-cancel', className)}
    {...props}
  />
));

AlertDialogContent.displayName = 'AlertDialogContent';
AlertDialogHeader.displayName = 'AlertDialogHeader';
AlertDialogTitle.displayName = 'AlertDialogTitle';
AlertDialogDescription.displayName = 'AlertDialogDescription';
AlertDialogFooter.displayName = 'AlertDialogFooter';
AlertDialogAction.displayName = 'AlertDialogAction';
AlertDialogCancel.displayName = 'AlertDialogCancel';