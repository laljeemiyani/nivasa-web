import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">N</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Nivasa Society
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Management System
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {children}
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
