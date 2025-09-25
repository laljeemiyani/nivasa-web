import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {ArrowRight, Calendar, CheckCircle, Eye, EyeOff, Home, Mail, Phone, Shield, User, UserCheck} from 'lucide-react';

// Enhanced Login Component
const Login = () => {
    const {login, user} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await login(formData);
            if (result.success) {
                // After successful login, the user state is updated in the context
                // Navigate to root, and ProtectedRoute will redirect to appropriate dashboard
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({general: 'Login failed. Please try again.'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="text-gray-600 text-sm">Sign in to access your dashboard</p>
            </div>

            {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <div className="w-5 h-5 text-red-500 mt-0.5">⚠</div>
                    <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Mail className="w-4 h-4"/>
                        <span>Email address</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.email
                                ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:bg-white hover:border-gray-400'
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                            <span>⚠</span>
                            <span>{errors.email}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                        <Shield className="w-4 h-4"/>
                        <span>Password</span>
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                errors.password
                                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:bg-white hover:border-gray-400'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400"/>
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400"/>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                            <span>⚠</span>
                            <span>{errors.password}</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span>Sign in</span>
                            <ArrowRight className="w-4 h-4"/>
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

// Enhanced Register Component
const Register = () => {
    const {register} = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        age: '',
        gender: '',
        wing: '',
        flatNumber: '',
        residentType: 'Owner',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateField = (name, value) => {
        let errorMessage = null;

        switch (name) {
            case 'fullName':
                if (!value.trim()) {
                    errorMessage = 'Full name is required';
                } else if (value.length > 100) {
                    errorMessage = 'Full name cannot exceed 100 characters';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    errorMessage = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'phoneNumber':
                if (!value.trim()) {
                    errorMessage = 'Phone number is required';
                } else if (!/^[0-9]{10}$/.test(value)) {
                    errorMessage = 'Phone number must be exactly 10 digits';
                }
                break;
            case 'age':
                if (value && (parseInt(value) < 18 || parseInt(value) > 120)) {
                    errorMessage = 'Age must be between 18 and 120 years';
                }
                break;
            case 'wing':
                if (value && !/^[A-F]$/.test(value.toUpperCase())) {
                    errorMessage = 'Wing must be a single letter from A to F';
                }
                break;
            case 'flatNumber':
                if (value && !/^([1-9]|1[0-4])(0[1-4])$/.test(value)) {
                    errorMessage = 'Flat number must be in format: 101-104, 201-204, ..., 1401-1404';
                }
                break;
            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters long';
                }
                break;
            case 'confirmPassword':
                if (!value) {
                    errorMessage = 'Please confirm your password';
                } else if (value !== formData.password) {
                    errorMessage = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        setErrors(prev => {
            const newErrors = {...prev};
            if (errorMessage) {
                newErrors[name] = errorMessage;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });

        return errorMessage;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        let processedValue = value;

        if (name === 'wing') {
            processedValue = value.toUpperCase();
        }

        if (name === 'phoneNumber') {
            processedValue = value.replace(/[^0-9]/g, '').substring(0, 10);
        }

        setFormData({
            ...formData,
            [name]: processedValue,
        });

        validateField(name, processedValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) validationErrors[key] = error;
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const result = await register(formData);
            if (result.success) {
                // Redirect to login page after successful registration
                setTimeout(() => {
                    navigate('/login');
                }, 1500); // Small delay to allow the success message to be seen
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                <p className="text-gray-600 text-sm">Fill in your details to register as a resident</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-600"/>
                        <span>Personal Information</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.fullName}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email"
                                   className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <Mail className="w-4 h-4"/>
                                <span>Email Address *</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="password"
                                   className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <Shield className="w-4 h-4"/>
                                <span>Password *</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password (min 6 characters)"
                                    className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400"/>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword"
                                   className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <CheckCircle className="w-4 h-4"/>
                                <span>Confirm Password *</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                        errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400"/>
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400"/>
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.confirmPassword}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-green-600"/>
                        <span>Contact Information</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                Phone Number *
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.phoneNumber}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="age"
                                   className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <Calendar className="w-4 h-4"/>
                                <span>Age (18+ only)</span>
                            </label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                min="18"
                                max="120"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter your age (18-120)"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.age}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="residentType"
                                   className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                                <UserCheck className="w-4 h-4"/>
                                <span>Resident Type *</span>
                            </label>
                            <select
                                id="residentType"
                                name="residentType"
                                required
                                value={formData.residentType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                            >
                                <option value="Owner">Owner</option>
                                <option value="Tenant">Tenant</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Residence Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                        <Home className="w-5 h-5 text-purple-600"/>
                        <span>Residence Information</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="wing" className="text-sm font-medium text-gray-700">
                                Wing (A-F)
                            </label>
                            <select
                                id="wing"
                                name="wing"
                                value={formData.wing}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.wing ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <option value="">Select wing</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                            </select>
                            {errors.wing && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.wing}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="flatNumber" className="text-sm font-medium text-gray-700">
                                Flat Number (101-1404)
                            </label>
                            <input
                                id="flatNumber"
                                name="flatNumber"
                                type="text"
                                value={formData.flatNumber}
                                onChange={handleChange}
                                placeholder="e.g., 101, 502, 1204"
                                maxLength="4"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                    errors.flatNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            {errors.flatNumber && (
                                <p className="text-red-500 text-sm flex items-center space-x-1">
                                    <span>⚠</span>
                                    <span>{errors.flatNumber}</span>
                                </p>
                            )}
                            <p className="text-gray-500 text-xs">
                                Format: Floor (1-14) + Flat (01-04). Example: 101, 502, 1404
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4"/>
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
};

// Enhanced Auth Layout
// In AuthLayout.jsx, replace the export with:
const AuthLayout = ({isLogin = true}) => {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Logo section */}
                <div className="text-center">
                    <div
                        className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-3xl font-bold text-white">N</span>
                    </div>
                    <h2 className="mt-6 text-4xl font-bold text-gray-900">Nivasa Society</h2>
                    <p className="mt-2 text-lg text-gray-600">Management System</p>
                </div>

                {/* Form */}
                <div className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100">
                    {isLogin ? <Login/> : <Register/>}
                </div>

                {/* Footer */}
                <div className="text-center space-y-3">
                    {isLogin ? (
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/register"
                               className="font-medium text-blue-600 hover:text-blue-500 transition-colors underline">
                                Sign up
                            </a>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/login"
                               className="font-medium text-blue-600 hover:text-blue-500 transition-colors underline">
                                Sign in
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;