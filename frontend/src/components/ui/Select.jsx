import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          });
        }
        if (child.type === SelectContent) {
          return isOpen ? React.cloneElement(child, {
            onSelect: handleSelect,
            onClose: () => setIsOpen(false),
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = forwardRef(({ className, children, onClick, selectedValue, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
));

export const SelectValue = forwardRef(({ className, placeholder, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('block truncate', className)}
    {...props}
  >
    {props.children || placeholder}
  </span>
));

export const SelectContent = forwardRef(({ className, children, onSelect, onClose, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-[60] min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
        'w-full mt-1',
        className
      )}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
});

export const SelectItem = forwardRef(({ className, children, value, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
      className
    )}
    onClick={() => onSelect(value)}
    {...props}
  >
    {children}
  </div>
));

SelectTrigger.displayName = 'SelectTrigger';
SelectValue.displayName = 'SelectValue';
SelectContent.displayName = 'SelectContent';
SelectItem.displayName = 'SelectItem';
