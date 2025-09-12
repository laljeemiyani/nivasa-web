import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Dialog = ({ children, open, onOpenChange, ...props }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="dialog-container" {...props}>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'dialog-content relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl',
      'animate-in fade-in-0 zoom-in-95 duration-300',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

export const DialogHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('dialog-header mb-4 flex flex-col space-y-1.5', className)}
    {...props}
  />
));

export const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('dialog-title text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

export const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('dialog-description text-sm text-gray-500', className)}
    {...props}
  />
));

export const DialogFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('dialog-footer flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
));

DialogContent.displayName = 'DialogContent';
DialogHeader.displayName = 'DialogHeader';
DialogTitle.displayName = 'DialogTitle';
DialogDescription.displayName = 'DialogDescription';
DialogFooter.displayName = 'DialogFooter';