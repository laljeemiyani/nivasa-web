import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast.jsx';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Input} from '../../components/ui/Input.jsx';
import {Label} from '../../components/ui/Label.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {Edit, Loader2, Trash2, UserPlus, Users} from 'lucide-react';
import {validateCommonEmail} from '../../utils/validators';

const ResidentFamily = () => {
    const {toast} = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
    const [formData, setFormData] = useState({
        fullName: '', relation: '', phone: '', email: '', age: '', gender: 'Male'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchFamilyMembers();
    }, []);

    const fetchFamilyMembers = async () => {
        try {
            setLoading(true);
            const response = await residentAPI.getFamilyMembers();
            setFamilyMembers(response.data.data.familyMembers);
        } catch (error) {
            console.error('Error fetching family members:', error);
            toast({
                title: 'Error', description: 'Failed to load family members', variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            fullName: '', relation: '', phone: '', email: '', age: '', gender: 'Male'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (member) => {
        setModalMode('edit');
        setSelectedMember(member);
        setFormData({
            fullName: member.fullName,
            relation: member.relation,
            phone: member.phone || '',
            email: member.email || '',
            age: member.age || '',
            gender: member.gender || 'Male'
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
        setTimeout(() => {
            setFormData({
                fullName: '', relation: '', phone: '', email: '', age: '', gender: 'Male'
            });
        }, 100);
    };

    const openDeleteDialog = (member) => {
        setSelectedMember(member);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedMember(null);
    };

    const validateField = (name, value) => {
        let errorMessage = null;

        switch (name) {
            case 'phone':
                if (value && !/^[0-9]{10}$/.test(value)) {
                    errorMessage = 'Phone number must be exactly 10 digits';
                }
                break;
            case 'age':
                if (value && (parseInt(value) < 0 || parseInt(value) > 120)) {
                    errorMessage = 'Age must be between 0 and 120';
                }
                break;
            case 'email':
                if (value && value.length > 0 && !validateCommonEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            default:
                break;
        }

        // Update the errors state
        setErrors(prev => {
            const newErrors = {...prev};
            if (errorMessage) {
                newErrors[name] = errorMessage;
            } else {
                delete newErrors[name];
            }
            return newErrors;
        });

        return errorMessage; // Return the error message for immediate use
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        // Only allow numeric input for phone number
        let processedValue = value;
        if (name === 'phone') {
            processedValue = value.replace(/[^0-9]/g, '').substring(0, 10);
        }
        
        setFormData(prev => ({
            ...prev, [name]: processedValue
        }));

        // Real-time validation
        validateField(name, processedValue);
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev, [name]: value
        }));

        // Real-time validation
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        const validationErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) validationErrors[key] = error;
        });

        // Check if there are any validation errors
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        try {
            setSubmitting(true);
            const formDataToSubmit = {
                ...formData, age: formData.age ? parseInt(formData.age, 10) : undefined
            };

            if (modalMode === 'create') {
                await residentAPI.addFamilyMember(formDataToSubmit);
                toast({
                    title: 'Success', description: 'Family member added successfully'
                });
            } else if (modalMode === 'edit') {
                await residentAPI.updateFamilyMember(selectedMember._id, formDataToSubmit);
                toast({
                    title: 'Success', description: 'Family member updated successfully'
                });
            }

            closeModal();
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error submitting family member:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save family member',
                variant: 'destructive'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await residentAPI.deleteFamilyMember(selectedMember._id);
            toast({
                title: 'Success', description: 'Family member deleted successfully'
            });
            closeDeleteDialog();
            fetchFamilyMembers();
        } catch (error) {
            console.error('Error deleting family member:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to delete family member',
                variant: 'destructive'
            });
        }
    };

    const getRelationColor = (relation) => {
        switch (relation.toLowerCase()) {
            case 'spouse':
                return 'blue';
            case 'child':
                return 'green';
            case 'parent':
                return 'purple';
            case 'sibling':
                return 'orange';
            default:
                return 'secondary';
        }
    };

    return (<div className="space-y-6">
        {/* Header Section - Responsive Design */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
                <p className="text-gray-600 mt-1">Manage your family member information</p>
            </div>
            <div className="flex-shrink-0">
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                    <UserPlus className="h-4 w-4"/>
                    <span>Add Family Member</span>
                </button>
            </div>
        </div>

        {/* Main Content Card */}
        <Card>
            <CardHeader>
                <CardTitle>Family Members</CardTitle>
                <CardDescription>Add and manage family member details</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                    </div>
                ) : familyMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                        <Users className="h-12 w-12 text-muted-foreground mb-2"/>
                        <h3 className="text-lg font-medium">No family members found</h3>
                        <p className="text-muted-foreground text-sm">
                            Click the "Add Family Member" button to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {familyMembers.map((member) => (
                            <div
                                key={member._id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h3 className="font-medium text-lg text-gray-900">{member.fullName}</h3>
                                            <Badge variant={getRelationColor(member.relation)}>
                                                {member.relation}
                                            </Badge>
                                        </div>
                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-600">
                                            {member.age && (
                                                <div>
                                                    <span className="font-medium">Age:</span> {member.age}
                                                </div>
                                            )}
                                            {member.gender && (
                                                <div>
                                                    <span className="font-medium">Gender:</span> {member.gender}
                                                </div>
                                            )}
                                            {member.phone && (
                                                <div className="sm:col-span-1 lg:col-span-2">
                                                    <span className="font-medium">Phone:</span> {member.phone}
                                                </div>
                                            )}
                                            {member.email && (
                                                <div className="sm:col-span-2">
                                                    <span className="font-medium">Email:</span> {member.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons - Always inline */}
                                    <div className="flex items-center gap-2 flex-shrink-0 self-start lg:self-center">
                                        <button
                                            onClick={() => openEditModal(member)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                        >
                                            <Edit className="h-4 w-4"/>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => openDeleteDialog(member)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Family Member Modal (Create/Edit) */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={closeModal}
                ></div>

                {/* Modal Content */}
                <div
                    className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {modalMode === 'create' ? 'Add Family Member' : 'Edit Family Member'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {modalMode === 'create' ? 'Fill in the details to add a new family member.' : 'Update the details of your family member.'}
                        </p>
                        {/* Close button */}
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={closeModal}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="px-6 py-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="relation">Relation *</Label>
                                <Input
                                    id="relation"
                                    name="relation"
                                    value={formData.relation}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Spouse, Child, Parent, Sibling"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        min="1"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleSelectChange('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter 10-digit phone number"
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    title="Phone number must be exactly 10 digits"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="e.g. family@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-transparent">
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {modalMode === 'create' ? 'Add Family Member' : 'Update Family Member'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Delete Confirmation Dialog */}
        {isDeleteDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={closeDeleteDialog}
                ></div>

                {/* Dialog Content */}
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                    <div className="px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            This action cannot be undone. This will permanently delete the family member record.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeDeleteDialog}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>);
};

export default ResidentFamily;