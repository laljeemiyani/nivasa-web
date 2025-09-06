import { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const Dropdown = forwardRef(({ 
  className, 
  trigger, 
  children,
  align = 'left',
  width = 'auto',
  closeOnSelect = true,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const combinedRef = (node) => {
    dropdownRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = () => {
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const widthClasses = {
    auto: 'min-w-[8rem]',
    full: 'w-full',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
  };

  return (
    <div 
      ref={combinedRef} 
      className={cn('dropdown relative inline-block', className)}
      {...props}
    >
      <div 
        className="dropdown-trigger cursor-pointer"
        onClick={toggleDropdown}
      >
        {trigger}
      </div>
      {isOpen && (
        <div 
          className={cn(
            'dropdown-content absolute z-50 mt-1 rounded-md border border-gray-200 bg-white py-1 shadow-lg',
            alignmentClasses[align],
            widthClasses[width]
          )}
          onClick={handleSelect}
        >
          {children}
        </div>
      )}
    </div>
  );
});

const DropdownItem = forwardRef(({ 
  className, 
  children, 
  disabled,
  onClick,
  ...props 
}, ref) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'dropdown-item flex w-full cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});

const DropdownSeparator = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('dropdown-separator my-1 h-px bg-gray-200', className)}
    {...props}
  />
));

Dropdown.displayName = 'Dropdown';
DropdownItem.displayName = 'DropdownItem';
DropdownSeparator.displayName = 'DropdownSeparator';

export { Dropdown, DropdownItem, DropdownSeparator };