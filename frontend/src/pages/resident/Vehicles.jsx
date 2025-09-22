import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { residentAPI } from '../../services/api';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '../../components/ui/Dialog.jsx';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from '../../components/ui/AlertDialog.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Car, CheckCircle, Clock, Edit, Loader2, Plus, Trash2, XCircle } from 'lucide-react';

const ResidentVehicles = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const [currentPage] = useState(1);
    const [formData, setFormData] = useState({
        vehicleType: '',
        manufacturer: '',
        model: '',
        color: '',
        registrationNumber: '',
        parkingSlot: ''
    });

    useEffect(() => {
        fetchVehicles();
    }, [currentPage]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await residentAPI.getVehicles();

            // Handle response based on the actual API structure
            if (Array.isArray(response)) {
                setVehicles(response);
            } else if (response && response.data && Array.isArray(response.data)) {
                setVehicles(response.data);
            } else if (response && response.data && response.data.vehicles) {
                setVehicles(response.data.vehicles);
            } else {
                setVehicles([]);
            }

        } catch (error) {
            console.error('Vehicle fetch error:', error);
            toast({ title: 'Error', description: 'Failed to load vehicles', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ vehicleType: '', manufacturer: '', model: '', color: '', registrationNumber: '', parkingSlot: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setModalMode('edit');
        setSelectedVehicle(vehicle);
        setFormData({
            vehicleType: vehicle.vehicleType || '',
            manufacturer: vehicle.manufacturer || '',
            model: vehicle.model || '',
            color: vehicle.color || '',
            registrationNumber: vehicle.registrationNumber || '',
            parkingSlot: vehicle.parkingSlot || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
        setTimeout(() => {
            setFormData({ vehicleType: '', manufacturer: '', model: '', color: '', registrationNumber: '', parkingSlot: '' });
        }, 100);
    };

    const openDeleteDialog = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setSelectedVehicle(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (modalMode === 'create') {
                await residentAPI.addVehicle(formData);
                toast({ title: 'Success', description: 'Vehicle added successfully' });
            } else if (modalMode === 'edit') {
                await residentAPI.updateVehicle(selectedVehicle._id, formData);
                toast({ title: 'Success', description: 'Vehicle updated successfully' });
            }
            closeModal();
            fetchVehicles();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to save vehicle',
                variant: 'destructive'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await residentAPI.deleteVehicle(selectedVehicle._id);
            toast({ title: 'Success', description: 'Vehicle deleted successfully' });
            closeDeleteDialog();
            fetchVehicles();
        } catch (error) {
            toast({ title: 'Error', description: error.response?.data?.message || 'Failed to delete vehicle', variant: 'destructive' });
        }
    };

    const getVehicleTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'car': return 'blue';
            case 'bike': return 'green';
            case 'scooter': return 'purple';
            case 'truck': return 'orange';
            default: return 'secondary';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3"/>Approved</Badge>;
            case 'rejected': return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3"/>Rejected</Badge>;
            default: return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3"/>Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6 px-4 md:px-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
                    <p className="text-gray-600 mt-1">Manage your registered vehicles with ease</p>
                    <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                        <Clock className="h-4 w-4"/> New vehicles require admin approval
                    </p>
                </div>
                <Button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="h-4 w-4"/> Add Vehicle
                </Button>
            </div>

            {/* Vehicles List */}
            <Card className="shadow-lg border border-gray-200">
                <CardHeader>
                    <CardTitle>Vehicles</CardTitle>
                    <CardDescription>Manage all your vehicle information here</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                            <Car className="h-14 w-14 mb-2"/>
                            <h3 className="text-lg font-semibold">No vehicles found</h3>
                            <p className="mt-1">Click "Add Vehicle" to register your first vehicle.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {vehicles.map(vehicle => (
                                <div key={vehicle._id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-lg">{vehicle.manufacturer} {vehicle.model}</h3>
                                                <Badge variant={getVehicleTypeColor(vehicle.vehicleType)}>{vehicle.vehicleType}</Badge>
                                                {getStatusBadge(vehicle.status)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                                <div><span className="font-medium">Reg. No:</span> {vehicle.registrationNumber}</div>
                                                {vehicle.color && <div><span className="font-medium">Color:</span> {vehicle.color}</div>}
                                                {vehicle.parkingSlot && <div><span className="font-medium">Parking:</span> {vehicle.parkingSlot}</div>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 mt-2 md:mt-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditModal(vehicle)}
                                                disabled={vehicle.status === "approved"}
                                                className="flex items-center gap-1"
                                            >
                                                <Edit className="h-4 w-4"/> Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 border-red-200 hover:bg-red-50"
                                                onClick={() => openDeleteDialog(vehicle)}
                                                disabled={vehicle.status === "approved"}
                                            >
                                                <Trash2 className="h-4 w-4"/> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Vehicle Modal */}
            <Dialog open={isModalOpen} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{modalMode === 'create' ? 'Add Vehicle' : 'Edit Vehicle'}</DialogTitle>
                        <DialogDescription>{modalMode === 'create' ? 'Register a new vehicle' : 'Update vehicle details'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                                <Input id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} placeholder="Car, Bike, Scooter" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" value={formData.color} onChange={handleInputChange} placeholder="Red, Blue, Black"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="manufacturer">Manufacturer *</Label>
                                <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="Toyota, Honda, Ford" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model *</Label>
                                <Input id="model" name="model" value={formData.model} onChange={handleInputChange} placeholder="Corolla, Civic, Mustang" required/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationNumber">Registration Number *</Label>
                                <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="ABC-123" required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parkingSlot">Parking Slot</Label>
                                <Input id="parkingSlot" name="parkingSlot" value={formData.parkingSlot} onChange={handleInputChange} placeholder="A-12, B-05"/>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit" className="w-full flex justify-center items-center gap-2" disabled={submitting}>
                                {submitting && <Loader2 className="animate-spin h-5 w-5"/>}
                                {modalMode === 'create' ? 'Add Vehicle' : 'Update Vehicle'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vehicle?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="space-x-2">
                        <AlertDialogCancel className="border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ResidentVehicles;
