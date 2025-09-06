import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

export const FileUpload = forwardRef(({ 
  className, 
  label = 'Upload File',
  accept,
  maxSize = 10485760, // 10MB default
  multiple = false,
  variant = 'default',
  size = 'md',
  error,
  onChange,
  value,
  onRemove,
  showPreview = true,
  ...props 
}, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  
  // Use either controlled (value) or uncontrolled (localFiles) state
  const files = value || localFiles;
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList);
    
    // Filter files by size
    const validFiles = filesArray.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== filesArray.length) {
      // Some files were too large
      if (error) {
        error(`Some files exceeded the maximum size of ${formatFileSize(maxSize)}`);
      }
    }
    
    if (!multiple) {
      // Single file mode - replace existing file
      const newFiles = validFiles.slice(0, 1);
      setLocalFiles(newFiles);
      if (onChange) onChange(newFiles[0] || null);
    } else {
      // Multiple files mode - add to existing files
      const newFiles = [...files, ...validFiles];
      setLocalFiles(newFiles);
      if (onChange) onChange(newFiles);
    }
  };
  
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    
    setLocalFiles(newFiles);
    
    if (onRemove) {
      onRemove(index);
    }
    
    if (onChange) {
      if (multiple) {
        onChange(newFiles);
      } else {
        onChange(null);
      }
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const variantClasses = {
    default: 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100',
    filled: 'border-2 border-dashed border-primary-300 bg-primary-50 hover:bg-primary-100',
    outlined: 'border-2 border-dashed border-gray-300 bg-transparent hover:border-primary-300',
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  
  return (
    <div className="w-full">
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      
      <div
        className={cn(
          'rounded-lg transition-colors',
          variantClasses[variant],
          sizeClasses[size],
          dragActive && 'border-primary-500 bg-primary-50',
          error && 'border-error-300 bg-error-50',
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500">
            Drag & drop files here, or
            <label className="mx-1 text-primary-600 hover:text-primary-500 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                ref={ref}
                {...props}
              />
            </label>
          </p>
          <p className="text-xs text-gray-400">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
      
      {/* File preview */}
      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <FiFile className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate" style={{ maxWidth: '200px' }}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;