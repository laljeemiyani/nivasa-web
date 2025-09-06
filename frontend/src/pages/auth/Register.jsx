import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const Register = () => {
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
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'phoneNumber':
        if (value && !/^[0-9]{10}$/.test(value)) {
          newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      case 'age':
        if (value && (parseInt(value) < 18 || parseInt(value) > 120)) {
          newErrors.age = 'Age must be between 18 and 120 years (only adults can register)';
        } else {
          delete newErrors.age;
        }
        break;
      case 'wing':
        if (value && !/^[A-F]$/.test(value.toUpperCase())) {
          newErrors.wing = 'Wing must be a single letter from A to F';
        } else {
          delete newErrors.wing;
        }
        break;
      case 'flatNumber':
        if (value && !/^(([1-9]|1[0-4])0[1-4])$/.test(value)) {
          newErrors.flatNumber = 'Flat number must be in format: 101-104, 201-204, ..., 1401-1404 (floors 1-14, flats 01-04)';
        } else {
          delete newErrors.flatNumber;
        }
        break;
      case 'password':
        if (value && value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters long';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Auto-format wing to uppercase
    if (name === 'wing') {
      processedValue = value.toUpperCase();
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
    
    // Real-time validation
    validateField(name, processedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });
    
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Fill in your details to register as a resident
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="label">
                Full Name *
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="label">
                Password *
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min 6 characters)"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm Password *
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="label">
                Phone Number *
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="label">
                Age (18+ only)
              </label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age (18-120)"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="residentType" className="label">
                Resident Type *
              </label>
              <select
                id="residentType"
                name="residentType"
                required
                value={formData.residentType}
                onChange={handleChange}
                className="input"
              >
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wing" className="label">
                Wing (A-F)
              </label>
              <select
                id="wing"
                name="wing"
                value={formData.wing}
                onChange={handleChange}
                className="input"
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
                <p className="text-red-500 text-sm mt-1">{errors.wing}</p>
              )}
            </div>

            <div>
              <label htmlFor="flatNumber" className="label">
                Flat Number (101-1404)
              </label>
              <Input
                id="flatNumber"
                name="flatNumber"
                type="text"
                value={formData.flatNumber}
                onChange={handleChange}
                placeholder="e.g., 101, 502, 1204"
                maxLength="4"
              />
              {errors.flatNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.flatNumber}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Format: Floor (1-14) + Flat (01-04). Example: 101, 502, 1404
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;
