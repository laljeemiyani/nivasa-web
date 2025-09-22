import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast.jsx';
import { residentAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/AlertDialog.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Loader2, Plus, Edit, Trash2, UserPlus, Users } from 'lucide-react';

const ResidentFamily = () => {
    const { toast } = useToast();
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const formDataToSubmit = {
                ...formData,
                age: formData.age ? parseInt(formData.age, 10) : undefined
            };
            if (modalMode === 'create') {
                await residentAPI.addFamilyMember(formDataToSubmit);
                toast({ title: 'Success', description: 'Family member added successfully' });
            } else if (modalMode === 'edit') {
                await residentAPI.updateFamilyMember(selectedMember._id, formDataToSubmit);
                toast({ title: 'Success', description: 'Family member updated successfully' });
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
            toast({ title: 'Success', description: 'Family member deleted successfully' });
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
            case 'spouse': return 'blue';
            case 'child': return 'green';
            case 'parent': return 'purple';
            case 'sibling': return 'orange';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold">Family Members</h1>
                    <p className="text-white/80 mt-1">Manage your family member information easily</p>
                </div>
                <Button className="bg-white text-indigo-600 hover:bg-white/90 shadow-md flex items-center" onClick={openCreateModal}>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Add Member
                </Button>
            </div>

            {/* Family Members List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center h-64">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                    </div>
                ) : familyMembers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-center text-gray-500">
                        <Users className="h-14 w-14 mb-3" />
                        <h3 className="text-xl font-medium">No family members yet</h3>
                        <p className="text-gray-400 mt-1">Click the button above to add your first family member</p>
                    </div>
                ) : (
                    familyMembers.map((member) => (
                        <Card key={member._id} className="rounded-2xl shadow hover:shadow-lg transition-shadow p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{member.fullName}</h3>
                                    <div className="mt-1">
                                        <Badge variant={getRelationColor(member.relation)}>{member.relation}</Badge>
                                    </div>
                                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600">
                                        {member.age && <div><span className="font-medium">Age:</span> {member.age}</div>}
                                        {member.gender && <div><span className="font-medium">Gender:</span> {member.gender}</div>}
                                        {member.phone && <div><span className="font-medium">Phone:</span> {member.phone}</div>}
                                        {member.email && <div><span className="font-medium">Email:</span> {member.email}</div>}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2 ml-4">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openEditModal(member)}>
                                        <Edit className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1" onClick={() => openDeleteDialog(member)}>
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-md w-full p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            {modalMode === 'create' ? 'Add Family Member' : 'Edit Family Member'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 mt-1">
                            {modalMode === 'create'
                                ? 'Enter details to add a new member'
                                : 'Update member information'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        {/* Full Name */}
                        <div>
                            <Label htmlFor="fullName" className="text-gray-700">Full Name *</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                            />
                        </div>

                        {/* Relation */}
                        <div>
                            <Label htmlFor="relation" className="text-gray-700">Relation *</Label>
                            <Input
                                id="relation"
                                name="relation"
                                value={formData.relation}
                                onChange={handleInputChange}
                                placeholder="Spouse, Child, Parent, Sibling"
                                required
                                className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                            />
                        </div>

                        {/* Age & Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="age" className="text-gray-700">Age</Label>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    min="1" max="120"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="Enter age"
                                    className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => handleSelectChange('gender', value)}
                                >
                                    <SelectTrigger className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. +1 (555) 123-4567"
                                className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. family@example.com"
                                className="mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
                            />
                        </div>

                        {/* Submit Button */}
                        <DialogFooter className="mt-6">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md py-2"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin inline mr-2" />}
                                {modalMode === 'create' ? 'Add Member' : 'Update Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
                <AlertDialogContent className="rounded-2xl shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. Delete this family member?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="space-x-2">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ResidentFamily;
