import React, { forwardRef, createContext, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

const TabsContext = createContext({});

const Tabs = forwardRef(({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
  const [selectedTab, setSelectedTab] = useState(value || defaultValue);

  const handleTabChange = (value) => {
    setSelectedTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TabsContext.Provider value={{ selectedTab, handleTabChange }}>
      <div ref={ref} className={cn('tabs', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

const TabsList = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

const TabsTrigger = forwardRef(({ className, value, children, ...props }, ref) => {
  const { selectedTab, handleTabChange } = useContext(TabsContext);
  const isActive = selectedTab === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground',
        className
      )}
      onClick={() => handleTabChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = forwardRef(({ className, value, children, ...props }, ref) => {
  const { selectedTab } = useContext(TabsContext);
  const isActive = selectedTab === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Tabs.displayName = 'Tabs';
TabsList.displayName = 'TabsList';
TabsTrigger.displayName = 'TabsTrigger';
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };