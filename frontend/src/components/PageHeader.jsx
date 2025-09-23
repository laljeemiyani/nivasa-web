import React from 'react';
import { cn } from '../utils/cn';

const PageHeader = ({ title, description, className, children, ...props }) => {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)} {...props}>
      <div>
        {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
};

export default PageHeader;