import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { residentAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Label } from '../../components/ui/Label.jsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog.jsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/AlertDialog.jsx';
import { Badge } from '../../components/ui/Badge.jsx';

import { Loader2, Plus, Edit, Trash2, Car, CheckCircle, XCircle, Clock } from 'lucide-react';

const ResidentVehicles = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      const response = await residentAPI.getVehicles(currentPage);
      setVehicles(response.data.data.vehicles);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vehicles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      vehicleType: '',
      manufacturer: '',
      model: '',
      color: '',
      registrationNumber: '',
      parkingSlot: ''
    });
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
    // Reset form after a short delay to avoid visual glitches
    setTimeout(() => {
      setFormData({
        vehicleType: '',
        manufacturer: '',
        model: '',
        color: '',
        registrationNumber: '',
        parkingSlot: ''
      });
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      if (modalMode === 'create') {
        await residentAPI.addVehicle(formData);
        toast({
          title: 'Success',
          description: 'Vehicle added successfully'
        });
      } else if (modalMode === 'edit') {
        await residentAPI.updateVehicle(selectedVehicle._id, formData);
        toast({
          title: 'Success',
          description: 'Vehicle updated successfully'
        });
      }
      
      closeModal();
      fetchVehicles();
    } catch (error) {
      console.error('Error submitting vehicle:', error);
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
      toast({
        title: 'Success',
        description: 'Vehicle deleted successfully'
      });
      closeDeleteDialog();
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete vehicle',
        variant: 'destructive'
      });
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
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Approval
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-600">Manage your registered vehicles</p>
          <p className="text-sm text-amber-600 mt-1">
            <Clock className="h-3 w-3 inline-block mr-1" />
            New vehicles require admin approval before they can be used
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>Add, edit, and manage your vehicle information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Car className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No vehicles found</h3>
              <p className="text-muted-foreground">
                Click the "Add Vehicle" button to register your first vehicle
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle._id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">
                          {vehicle.manufacturer} {vehicle.model}
                        </h3>
                        <Badge variant={getVehicleTypeColor(vehicle.vehicleType)}>
                          {vehicle.vehicleType}
                        </Badge>
                        {getStatusBadge(vehicle.status)}
                      </div>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Registration:</span> {vehicle.registrationNumber}
                        </div>
                        {vehicle.color && (
                          <div>
                            <span className="font-medium">Color:</span> {vehicle.color}
                          </div>
                        )}
                        {vehicle.parkingSlot && (
                          <div>
                            <span className="font-medium">Parking Slot:</span> {vehicle.parkingSlot}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(vehicle)}
                        disabled={vehicle.status === 'approved'}
                        title={vehicle.status === 'approved' ? 'Approved vehicles cannot be edited' : 'Edit vehicle'}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(vehicle)}
                        disabled={vehicle.status === 'approved'}
                        title={vehicle.status === 'approved' ? 'Approved vehicles cannot be deleted' : 'Delete vehicle'}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
          {vehicles.length > 0 && (
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
              >
                Previous
              </Button>
              <span className="px-3 py-2 border border-gray-300 rounded">{currentPage} / {totalPages}</span>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </Card>

      {/* Vehicle Modal (Create/Edit) */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'create' ? 'Add Vehicle' : 'Edit Vehicle'}
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'create' 
                ? 'Fill in the details to register a new vehicle.' 
                : 'Update the details of your vehicle.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Input
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    placeholder="e.g. Car, Bike, Scooter"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. Red, Blue, Black"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="e.g. Toyota, Honda, Ford"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g. Corolla, Civic, Mustang"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. ABC-123"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parkingSlot">Parking Slot</Label>
                  <Input
                    id="parkingSlot"
                    name="parkingSlot"
                    value={formData.parkingSlot}
                    onChange={handleInputChange}
                    placeholder="e.g. A-12, B-05"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {modalMode === 'create' ? 'Add Vehicle' : 'Update Vehicle'}
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
              This action cannot be undone. This will permanently delete the vehicle record.
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

export default ResidentVehicles;
