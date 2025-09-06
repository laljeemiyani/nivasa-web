import { useCallback } from 'react';
import { toast as reactToastify } from 'react-toastify';

/**
 * Custom hook for displaying toast notifications
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  // Use react-toastify for toast notifications
  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const content = (
      <div className="flex flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    );

    switch (variant) {
      case 'destructive':
        return reactToastify.error(content);
      case 'success':
        return reactToastify.success(content);
      case 'warning':
        return reactToastify.warning(content);
      case 'info':
        return reactToastify.info(content);
      default:
        return reactToastify(content);
    }
  }, []);

  return { toast };
};

export default useToast;