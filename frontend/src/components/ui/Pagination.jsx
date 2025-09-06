import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Pagination = forwardRef(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
));

const PaginationContent = forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));

const PaginationItem = forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));

const PaginationLink = forwardRef(
  ({ className, isActive, size = 'icon', ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'bg-transparent hover:bg-muted hover:text-accent-foreground',
        {
          'h-7 w-7': size === 'sm',
          'h-9 w-9': size === 'icon',
        },
        className
      )}
      {...props}
    />
  )
);

const PaginationPrevious = forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    ref={ref}
    {...props}
  >
    <span>Previous</span>
  </PaginationLink>
));

const PaginationNext = forwardRef(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    ref={ref}
    {...props}
  >
    <span>Next</span>
  </PaginationLink>
));

const PaginationEllipsis = forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <span className="text-sm">...</span>
  </span>
));

Pagination.displayName = 'Pagination';
PaginationContent.displayName = 'PaginationContent';
PaginationItem.displayName = 'PaginationItem';
PaginationLink.displayName = 'PaginationLink';
PaginationPrevious.displayName = 'PaginationPrevious';
PaginationNext.displayName = 'PaginationNext';
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};