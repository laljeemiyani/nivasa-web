import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { residentAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import FileUpload from '../../components/ui/FileUpload.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs.jsx';
import { Loader2 } from 'lucide-react';
import { FiUser } from 'react-icons/fi';

const ResidentProfile = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        age: '',
        gender: '',
        wing: '',
        flatNumber: '',
        residentType: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfilePhotoUpload = async (file) => {
        if (!file) return;

        try {
            setUploadingPhoto(true);
            const form = new FormData();
            form.append('profilePhoto', file);
            const response = await residentAPI.updateProfilePhoto(form);

            if (response.data.success) {
                setProfilePhoto({
                    preview: URL.createObjectURL(file),
                    name: file.name
                });
                toast.success('Profile photo updated successfully');
            }
        } catch (error) {
            console.error('Error uploading profile photo:', error);
            toast.error(error.response?.data?.message || 'Failed to upload profile photo');
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

            if (user.profilePhoto) {
                setProfilePhoto({
                    preview: `${import.meta.env.VITE_API_URL}/uploads/profile_photos/${user.profilePhoto}`,
                    name: user.profilePhoto
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
                title: 'Error',
                description: 'Failed to load profile information',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await residentAPI.updateProfile(formData);
            toast({ title: 'Success', description: 'Profile updated successfully' });
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
            toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
            return;
        }

        try {
            setChangingPassword(true);
            await residentAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            toast({ title: 'Success', description: 'Password changed successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Gradient Header */}
            <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 p-8 shadow-xl text-white">
                <h1 className="text-4xl font-extrabold tracking-wide">My Profile</h1>
                <p className="mt-2 text-lg text-gray-100/90">Manage your personal information</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                {/* Tabs with Gradient */}
                <TabsList className="grid w-full md:w-[450px] grid-cols-2 rounded-xl p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 shadow-md">
                    <TabsTrigger value="profile" className="rounded-lg bg-white text-gray-800 font-semibold shadow-sm hover:scale-105 transition-transform duration-200">Profile</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg bg-white text-gray-800 font-semibold shadow-sm hover:scale-105 transition-transform duration-200">Security</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-8">
                    <Card className="shadow-lg border border-gray-100 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-purple-600">Profile Information</CardTitle>
                            <CardDescription>View and edit your profile details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-8">
                                {/* Profile Photo */}
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex flex-col items-center space-y-3">
                                        <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-purple-500 shadow-md">
                                            {profilePhoto ? (
                                                <img src={profilePhoto.preview} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <FiUser className="w-20 h-20 text-gray-400" />
                                            )}
                                        </div>
                                        <FileUpload
                                            label="Update Photo"
                                            accept="image/*"
                                            onChange={handleProfilePhotoUpload}
                                            multiple={false}
                                            size="md"
                                            className="mt-2"
                                        />
                                        {uploadingPhoto && (
                                            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                                Uploading...
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="border-purple-300 focus:ring-purple-500" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                            pattern="[0-9]{10}"
                                            title="Phone number must be 10 digits"
                                            className="border-purple-300 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age</Label>
                                        <Input id="age" name="age" type="number" min="18" max="120" value={formData.age} onChange={handleInputChange} className="border-purple-300 focus:ring-purple-500"/>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                                            <SelectTrigger className="border-purple-300 focus:ring-purple-500">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="wing">Wing</Label>
                                        <Select value={formData.wing} onValueChange={(v) => handleSelectChange('wing', v)}>
                                            <SelectTrigger className="border-purple-300 focus:ring-purple-500">
                                                <SelectValue placeholder="Select wing" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['A', 'B', 'C', 'D', 'E', 'F'].map(wing => (
                                                    <SelectItem key={wing} value={wing}>{wing}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="flatNumber">Flat Number</Label>
                                        <Input
                                            id="flatNumber"
                                            name="flatNumber"
                                            value={formData.flatNumber}
                                            onChange={handleInputChange}
                                            pattern="^(([1-9]|1[0-4])0[1-4])$"
                                            title="Flat number must be in format: 101-104, 201-204, ..., 1401-1404"
                                            className="border-purple-300 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="residentType">Resident Type</Label>
                                        <Select value={formData.residentType} onValueChange={(v) => handleSelectChange('residentType', v)} required>
                                            <SelectTrigger className="border-purple-300 focus:ring-purple-500">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Owner">Owner</SelectItem>
                                                <SelectItem value="Tenant">Tenant</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-red-400 text-white font-semibold shadow-lg flex items-center gap-2" disabled={saving}>
                                        {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-8">
                    <Card className="shadow-lg border border-gray-100 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-purple-600">Change Password</CardTitle>
                            <CardDescription>Update your password securely</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        className="border-purple-300 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                        className="border-purple-300 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                        minLength={6}
                                        className="border-purple-300 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-red-400 text-white font-semibold shadow-lg flex items-center gap-2" disabled={changingPassword}>
                                        {changingPassword && <Loader2 className="h-5 w-5 animate-spin" />}
                                        Change Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ResidentProfile;
