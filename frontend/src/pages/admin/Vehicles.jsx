import {useEffect, useState} from 'react';
import {adminAPI} from '../../services/api';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../components/ui/Card.jsx';
import {Button} from '../../components/ui/Button.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle} from '../../components/ui/Modal.jsx';
import {Input} from '../../components/ui/Input.jsx';
import {useToast} from '../../hooks/useToast.jsx';
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

const AdminVehicles = () => {
    const {toast} = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusAction, setStatusAction] = useState(null);
    const [processingStatus, setProcessingStatus] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, [page, vehicleTypeFilter, statusFilter]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getVehicles({
                page,
                limit: 10,
                vehicleType: vehicleTypeFilter || undefined,
                status: statusFilter || undefined,
                search: searchQuery || undefined
            });

            setVehicles(response.data.data.vehicles);
            setTotalPages(response.data.data.pagination.totalPages);
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

    const handleUpdateStatus = async (status) => {
        try {
            setProcessingStatus(true);
            await adminAPI.updateVehicleStatus(selectedVehicle._id, {status});

            // Update the vehicle in the local state
            setVehicles(vehicles.map(vehicle =>
                vehicle._id === selectedVehicle._id ? {...vehicle, status} : vehicle
            ));

            toast({
                title: 'Success',
                description: `Vehicle ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
                variant: 'default'
            });

            setStatusDialogOpen(false);
            setSelectedVehicle(null);
            setStatusAction(null);
        } catch (error) {
            console.error('Error updating vehicle status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update vehicle status',
                variant: 'destructive'
            });
        } finally {
            setProcessingStatus(false);
        }
    };

    const openStatusDialog = (vehicle, action) => {
        setSelectedVehicle(vehicle);
        setStatusAction(action);
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
        setSelectedVehicle(null);
        setStatusAction(null);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVehicles();
    };

    const openVehicleModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedVehicle(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getVehicleTypeBadgeVariant = (type) => {
        return type === 'Two Wheeler' ? 'info' : 'warning';
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'destructive';
            case 'pending':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
                <p className="text-gray-600">View and manage all registered vehicles</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vehicles</CardTitle>
                    <CardDescription>View all registered vehicles in the society</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                            <label htmlFor="vehicleTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Vehicle Type
                            </label>
                            <select
                                id="vehicleTypeFilter"
                                className="border border-gray-300 rounded px-3 py-2"
                                value={vehicleTypeFilter}
                                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="Two Wheeler">Two Wheeler</option>
                                <option value="Four Wheeler">Four Wheeler</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Status
                            </label>
                            <select
                                id="statusFilter"
                                className="border border-gray-300 rounded px-3 py-2"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="flex-grow">
                            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Vehicles
                            </label>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    id="searchQuery"
                                    type="text"
                                    placeholder="Search by vehicle name or number"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button type="submit" variant="primary">
                                    Search
                                </Button>
                            </form>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading vehicles...</p>
                    ) : vehicles.length === 0 ? (
                        <p>No vehicles found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Vehicle Number</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Vehicle Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Owner</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Flat</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle._id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{vehicle.vehicleNumber}</td>
                                        <td className="border border-gray-300 px-4 py-2">{vehicle.vehicleName}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <Badge variant={getVehicleTypeBadgeVariant(vehicle.vehicleType)}>
                                                {vehicle.vehicleType}
                                            </Badge>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {vehicle.userId?.fullName || 'Unknown'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {vehicle.userId ? `${vehicle.userId.wing}-${vehicle.userId.flatNumber}` : 'N/A'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <Badge variant={getStatusBadgeVariant(vehicle.status || 'pending')}>
                                                {vehicle.status || 'pending'}
                                            </Badge>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="flex space-x-2">
                                                <Button onClick={() => openVehicleModal(vehicle)} variant="default"
                                                        size="sm">
                                                    View Details
                                                </Button>
                                                {vehicle.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            onClick={() => openStatusDialog(vehicle, 'approve')}
                                                            variant="success"
                                                            size="sm"
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            onClick={() => openStatusDialog(vehicle, 'reject')}
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center space-x-2">
                        <Button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            size="sm"
                        >
                            Previous
                        </Button>
                        <span className="px-3 py-2 border border-gray-300 rounded">{page} / {totalPages}</span>
                        <Button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Vehicle Details Modal */}
            <Modal isOpen={modalOpen} onClose={closeModal} size="md">
                <ModalHeader>
                    <ModalTitle>Vehicle Details</ModalTitle>
                    <ModalCloseButton onClick={closeModal}/>
                </ModalHeader>
                <ModalBody>
                    {selectedVehicle && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p><strong>Vehicle Number:</strong> {selectedVehicle.vehicleNumber}</p>
                                <p><strong>Vehicle Name:</strong> {selectedVehicle.vehicleName}</p>
                                <p><strong>Vehicle Type:</strong> {selectedVehicle.vehicleType}</p>
                                <p><strong>Vehicle Model:</strong> {selectedVehicle.vehicleModel || 'Not specified'}</p>
                                <p><strong>Vehicle Color:</strong> {selectedVehicle.vehicleColor || 'Not specified'}</p>
                                <p><strong>Registration Date:</strong> {formatDate(selectedVehicle.registrationDate)}
                                </p>
                                <p><strong>Owner Name:</strong> {selectedVehicle.userId?.fullName || 'Unknown'}</p>
                                <p><strong>Owner Email:</strong> {selectedVehicle.userId?.email || 'Unknown'}</p>
                                <p><strong>Flat
                                    Number:</strong> {selectedVehicle.userId ? `${selectedVehicle.userId.wing}-${selectedVehicle.userId.flatNumber}` : 'N/A'}
                                </p>
                                <p><strong>Registered On:</strong> {formatDate(selectedVehicle.createdAt)}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <Badge variant={getStatusBadgeVariant(selectedVehicle.status || 'pending')}>
                                        {selectedVehicle.status || 'pending'}
                                    </Badge>
                                </p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={closeModal} variant="secondary">
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Status Update Dialog */}
            <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {statusAction === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {statusAction === 'approve'
                                ? 'Are you sure you want to approve this vehicle? This will allow the resident to use this vehicle in the society.'
                                : 'Are you sure you want to reject this vehicle? This will prevent the resident from using this vehicle in the society.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeStatusDialog} disabled={processingStatus}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleUpdateStatus(statusAction === 'approve' ? 'approved' : 'rejected')}
                            disabled={processingStatus}
                            className={statusAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {processingStatus ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Processing...
                                </>
                            ) : statusAction === 'approve' ? (
                                'Approve'
                            ) : (
                                'Reject'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminVehicles;
