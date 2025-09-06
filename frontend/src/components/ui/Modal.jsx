import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

const Modal = forwardRef(({ 
  className, 
  children, 
  isOpen, 
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  ...props 
}, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (closeOnEsc) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full',
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={ref}
        className={cn(
          'modal relative w-full rounded-lg bg-white p-6 shadow-xl',
          sizeClasses[size],
          'animate-in fade-in-0 zoom-in-95 duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
});

const ModalHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('modal-header mb-4 flex items-start justify-between', className)}
    {...props}
  />
));

const ModalTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('modal-title text-xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

const ModalDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('modal-description text-sm text-text-secondary', className)}
    {...props}
  />
));

const ModalBody = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('modal-body', className)} {...props} />
));

const ModalFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('modal-footer mt-6 flex items-center justify-end gap-2', className)}
    {...props}
  />
));

const ModalCloseButton = forwardRef(({ className, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'modal-close-button absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100',
      className
    )}
    onClick={onClick}
    {...props}
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
    <span className="sr-only">Close</span>
  </button>
));

Modal.displayName = 'Modal';
ModalHeader.displayName = 'ModalHeader';
ModalTitle.displayName = 'ModalTitle';
ModalDescription.displayName = 'ModalDescription';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalCloseButton.displayName = 'ModalCloseButton';

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
};