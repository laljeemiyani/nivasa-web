import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast';
import {useAuth} from '../../context/AuthContext';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Button} from '../../components/ui/Button.jsx';
import {Input} from '../../components/ui/Input.jsx';
import FileUpload from '../../components/ui/FileUpload.jsx';
import {Label} from '../../components/ui/Label.jsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/Select.jsx';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../../components/ui/Tabs.jsx';
import {
    AlertCircle,
    Calendar,
    Camera,
    CheckCircle2,
    Edit3,
    Eye,
    EyeOff,
    Home,
    Loader2,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    Users
} from 'lucide-react';

const ResidentProfile = () => {
    const {toast} = useToast();
    const {updateProfilePhoto} = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false, new: false, confirm: false
    });
    const [formData, setFormData] = useState({
        fullName: '', phoneNumber: '', age: '', gender: '', wing: '', flatNumber: '', residentType: ''
    });
    const [errors, setErrors] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfilePhotoUpload = async (file) => {
        if (!file) return;

        try {
            setUploadingPhoto(true);

            const formDataUpload = new FormData();
            formDataUpload.append('profilePhoto', file);

            const result = await updateProfilePhoto(formDataUpload);

            if (result.success) {
                setProfilePhoto({
                    preview: URL.createObjectURL(file), name: file.name
                });
                toast({
                    title: 'Success', description: 'Profile photo updated successfully',
                });
            }
        } catch (error) {
            console.error('Error uploading profile photo:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to upload profile photo',
                variant: 'destructive'
            });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await residentAPI.getProfile();
            setProfile(response.data.data.user);

            const user = response.data.data.user;

            if (user.profilePhotoUrl) {
                setProfilePhoto({
                    preview: `${import.meta.env.VITE_API_URL}/uploads/profile_photos/${user.profilePhotoUrl}`,
                    name: user.profilePhotoUrl
                });
            }

            setFormData({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                age: user.age || '',
                gender: user.gender || '',
                wing: user.wing || '',
                flatNumber: user.flatNumber || '',
                residentType: user.residentType || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: 'Error', description: 'Failed to load profile information', variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev, [name]: value
        }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMessage = null;

        switch (name) {
            case 'phoneNumber':
                if (value && !/^[0-9]{10}$/.test(value)) {
                    errorMessage = 'Phone number must be exactly 10 digits';
                }
                break;
            case 'age':
                if (value && (parseInt(value) < 18 || parseInt(value) > 120)) {
                    errorMessage = 'Age must be between 18 and 120 years';
                }
                break;
            case 'flatNumber':
                if (value && !/^([1-9]|1[0-4])(0[1-4])$/.test(value)) {
                    errorMessage = 'Flat number must be in format: 101-104, 201-204, ..., 1401-1404 (floors 1-14, flats 01-04)';
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        let processedValue = value;
        if (name === 'phoneNumber') {
            processedValue = value.replace(/[^0-9]/g, '').substring(0, 10);
        }

        setFormData(prev => ({
            ...prev, [name]: processedValue
        }));

        validateField(name, processedValue);
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({
            ...prev, [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev, [field]: !prev[field]
        }));
    };

    const handleProfileUpdate = async (e) => {
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

        try {
            setSaving(true);
            await residentAPI.updateProfile(formData);
            toast({
                title: 'Success', description: 'Profile updated successfully', icon: <CheckCircle2 className="w-5 h-5"/>
            });
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update profile',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'New passwords do not match',
                variant: 'destructive',
                icon: <AlertCircle className="w-5 h-5"/>
            });
            return;
        }

        try {
            setChangingPassword(true);
            await residentAPI.changePassword({
                currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword
            });

            toast({
                title: 'Success',
                description: 'Password changed successfully',
                icon: <CheckCircle2 className="w-5 h-5"/>
            });

            setPasswordData({
                currentPassword: '', newPassword: '', confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to change password',
                variant: 'destructive'
            });
        } finally {
            setChangingPassword(false);
        }
    };

    const getFieldIcon = (fieldName) => {
        const icons = {
            fullName: User,
            phoneNumber: Phone,
            age: Calendar,
            gender: Users,
            wing: MapPin,
            flatNumber: Home,
            residentType: Users
        };
        return icons[fieldName] || User;
    };

    if (loading) {
        return (<div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your profile...</p>
        </div>);
    }

    return (<div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
                        <p className="text-gray-600">Manage your personal information and account settings</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div
                            className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            {profilePhoto ? (<img src={profilePhoto.preview} alt="Profile"
                                                  className="w-14 h-14 rounded-full object-cover"/>) : (
                                <User className="w-8 h-8 text-gray-400"/>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList
                    className="grid w-full md:w-[400px] grid-cols-2 bg-white border border-gray-200 rounded-lg p-1">
                    <TabsTrigger
                        value="profile"
                        className="flex items-center space-x-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <User className="w-4 h-4"/>
                        <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center space-x-2 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <Shield className="w-4 h-4"/>
                        <span>Security</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                                        <User className="w-5 h-5 text-blue-600"/>
                                        <span>Personal Information</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 mt-1">
                                        View and update your profile details
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={'!w-[200px]'}
                                    spanClasses={'flex justify-center items-center'}
                                >
                                    {isEditing ? (<>
                                        <Eye className="h-4 w-4 mr-2"/>
                                        View Mode
                                    </>) : (<>
                                        <Edit3 className="h-4 w-4 mr-2"/>
                                        Edit Profile
                                    </>)}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                {/* Profile Photo Section */}
                                <div
                                    className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="relative group">
                                        <div
                                            className="w-32 h-32 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-gray-200 shadow-sm">
                                            {profilePhoto ? (<img
                                                src={profilePhoto.preview}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />) : (<User className="w-16 h-16 text-gray-400"/>)}
                                        </div>
                                        {isEditing && (<div
                                            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-6 h-6 text-white"/>
                                        </div>)}
                                    </div>

                                    {isEditing && (<div className="w-full max-w-xs">
                                        <FileUpload
                                            label="Update Profile Photo"
                                            accept="image/*"
                                            onChange={handleProfilePhotoUpload}
                                            multiple={false}
                                            variant="outlined"
                                            size="sm"
                                        />
                                        {uploadingPhoto && (<div
                                            className="flex items-center justify-center mt-2 text-blue-600">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                            <span className="text-sm">Uploading...</span>
                                        </div>)}
                                    </div>)}
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(formData).map(([key, value]) => {
                                        const IconComponent = getFieldIcon(key);
                                        return (<div key={key} className="space-y-2">
                                            <Label
                                                htmlFor={key}
                                                className="text-sm font-medium text-gray-700 flex items-center space-x-2"
                                            >
                                                <IconComponent className="w-4 h-4 text-gray-500"/>
                                                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                {['fullName', 'phoneNumber', 'residentType'].includes(key) && (
                                                    <span className="text-red-500 text-xs">*</span>)}
                                            </Label>

                                            {['gender', 'wing', 'residentType'].includes(key) ? (<Select
                                                value={value}
                                                onValueChange={(val) => handleSelectChange(key, val)}
                                                disabled={!isEditing}
                                            >
                                                <SelectTrigger
                                                    className={`h-10 border-gray-300 ${isEditing ? 'bg-white hover:border-gray-400 focus:border-blue-500' : 'bg-gray-100'} ${errors[key] ? 'border-red-300' : ''}`}>
                                                    <SelectValue
                                                        placeholder={`Select ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}>
                                                        {value}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-200">
                                                    {key === 'gender' && (<>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </>)}
                                                    {key === 'wing' && ['A', 'B', 'C', 'D', 'E', 'F'].map(wing => (
                                                        <SelectItem key={wing}
                                                                    value={wing}>Wing {wing}</SelectItem>))}
                                                    {key === 'residentType' && (<>
                                                        <SelectItem value="Owner">Owner</SelectItem>
                                                        <SelectItem value="Tenant">Tenant</SelectItem>
                                                    </>)}
                                                </SelectContent>
                                            </Select>) : (<Input
                                                id={key}
                                                name={key}
                                                type={key === 'age' ? 'number' : 'text'}
                                                value={value}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                required={['fullName', 'phoneNumber'].includes(key)}
                                                className={`h-10 border-gray-300 ${isEditing ? 'bg-white hover:border-gray-400 focus:border-blue-500' : 'bg-gray-100'} ${errors[key] ? 'border-red-300' : ''}`}
                                                placeholder={key === 'flatNumber' ? 'e.g., 101, 502, 1204' : `Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                                {...(key === 'phoneNumber' && {
                                                    maxLength: "10", pattern: "[0-9]{10}"
                                                })}
                                                {...(key === 'age' && {min: "18", max: "120"})}
                                                {...(key === 'flatNumber' && {
                                                    pattern: "^(([1-9]|1[0-4])0[1-4])$", maxLength: "4"
                                                })}
                                            />)}

                                            {errors[key] && (<div
                                                className="flex items-center space-x-2 text-red-600 text-sm">
                                                <AlertCircle className="w-4 h-4"/>
                                                <span>{errors[key]}</span>
                                            </div>)}

                                            {key === 'flatNumber' && !errors[key] && (
                                                <p className="text-gray-500 text-xs">
                                                    Format: Floor (1-14) + Flat (01-04). Example: 101, 502, 1404
                                                </p>)}
                                        </div>);
                                    })}
                                </div>

                                {isEditing && (<div
                                    className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setErrors({});
                                        }}
                                        className="px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={saving || Object.keys(errors).length > 0}
                                        className="px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 shadow-md hover:shadow-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                          <span className="flex justify-center items-center">
                                            {saving ? (<>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                Saving...
                                            </>) : (<>
                                                <Save className="mr-2 h-4 w-4"/>
                                                Save Changes
                                            </>)}
                                          </span>
                                    </Button>

                                </div>)}
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                                <Shield className="w-5 h-5 text-blue-600"/>
                                <span>Security Settings</span>
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-1">
                                Change your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                                    <div key={field} className="space-y-2">
                                        <Label
                                            htmlFor={field}
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id={field}
                                                name={field}
                                                type={showPasswords[field.replace('Password', '').replace('current', 'current').replace('new', 'new').replace('confirm', 'confirm')] ? 'text' : 'password'}
                                                value={passwordData[field]}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={field !== 'currentPassword' ? 6 : undefined}
                                                className="h-10 border-gray-300 focus:border-blue-500 bg-white pr-10"
                                                placeholder="Enter password"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                                                onClick={() => togglePasswordVisibility(field.replace('Password', '').replace('current', 'current').replace('new', 'new').replace('confirm', 'confirm'))}
                                            >
                                                {showPasswords[field.replace('Password', '').replace('current', 'current').replace('new', 'new').replace('confirm', 'confirm')] ? (
                                                    <EyeOff className="h-4 w-4 text-gray-500"/>) : (
                                                    <Eye className="h-4 w-4 text-gray-500"/>)}
                                            </Button>
                                        </div>
                                        {field === 'newPassword' && (<p className="text-gray-500 text-xs">
                                            Password must be at least 6 characters long
                                        </p>)}
                                    </div>))}

                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <Button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="px-6 py-2.5 rounded-2xl font-medium transition-all duration-200 shadow-md hover:shadow-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <span className="flex justify-center items-center">
                                        {changingPassword ? (<>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Changing Password...
                                        </>) : (<>
                                            <Shield className="mr-2 h-4 w-4"/>
                                            Change Password
                                        </>)}
                                      </span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>);
};

export default ResidentProfile;