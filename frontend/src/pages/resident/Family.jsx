import {useEffect, useState} from 'react';
import {useToast} from '../../hooks/useToast.jsx';
import {residentAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Button} from '../../components/ui/Button.jsx';
import {Input} from '../../components/ui/Input.jsx';
import {Label} from '../../components/ui/Label.jsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/Select.jsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '../../components/ui/Dialog.jsx';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '../../components/ui/AlertDialog.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {Edit, Loader2, Trash2, UserPlus, Users} from 'lucide-react';

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
        fullName: '',
        relation: '',
        phone: '',
        email: '',
        age: '',
        gender: 'Male'
    });

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
                title: 'Error',
                description: 'Failed to load family members',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({
            fullName: '',
            relation: '',
            phone: '',
            email: '',
            age: '',
            gender: 'Male'
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
        // Reset form after a short delay to avoid visual glitches
        setTimeout(() => {
            setFormData({
                fullName: '',
                relation: '',
                phone: '',
                email: '',
                age: '',
                gender: 'Male'
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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // Validate age as a number
            const formDataToSubmit = {
                ...formData,
                age: formData.age ? parseInt(formData.age, 10) : undefined
            };

            if (modalMode === 'create') {
                await residentAPI.addFamilyMember(formDataToSubmit);
                toast({
                    title: 'Success',
                    description: 'Family member added successfully'
                });
            } else if (modalMode === 'edit') {
                await residentAPI.updateFamilyMember(selectedMember._id, formDataToSubmit);
                toast({
                    title: 'Success',
                    description: 'Family member updated successfully'
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
                title: 'Success',
                description: 'Family member deleted successfully'
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
                    <p className="text-gray-600">Manage your family member information</p>
                </div>
                <Button onClick={openCreateModal}>
                    <UserPlus className="h-4 w-4 mr-2"/>
                    Add Family Member
                </Button>
            </div>

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
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mb-2"/>
                            <h3 className="text-lg font-medium">No family members found</h3>
                            <p className="text-muted-foreground">
                                Click the "Add Family Member" button to add your first family member
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {familyMembers.map((member) => (
                                <div
                                    key={member._id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{member.fullName}</h3>
                                            <div className="mt-1">
                                                <Badge variant={getRelationColor(member.relation)}>
                                                    {member.relation}
                                                </Badge>
                                            </div>
                                            <div
                                                className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
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
                                                    <div>
                                                        <span className="font-medium">Phone:</span> {member.phone}
                                                    </div>
                                                )}
                                                {member.email && (
                                                    <div>
                                                        <span className="font-medium">Email:</span> {member.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(member)}
                                            >
                                                <Edit className="h-4 w-4 mr-1"/>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => openDeleteDialog(member)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1"/>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Family Member Modal (Create/Edit) */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'create' ? 'Add Family Member' : 'Edit Family Member'}
                        </DialogTitle>
                        <DialogDescription>
                            {modalMode === 'create'
                                ? 'Fill in the details to add a new family member.'
                                : 'Update the details of your family member.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
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
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleSelectChange('gender', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="e.g. +1 (555) 123-4567"
                                />
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
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {modalMode === 'create' ? 'Add Family Member' : 'Update Family Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the family member record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ResidentFamily;
