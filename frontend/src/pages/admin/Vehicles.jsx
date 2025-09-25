import {useEffect, useState} from 'react';
import {adminAPI} from '../../services/api';
import {Button} from '../../components/ui/Button.jsx';
import {Badge} from '../../components/ui/Badge.jsx';
import {Modal, ModalBody, ModalCloseButton, ModalFooter, ModalHeader, ModalTitle} from '../../components/ui/Modal.jsx';
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
                title: 'Error', description: 'Failed to load vehicles', variant: 'destructive'
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
            setVehicles(vehicles.map(vehicle => vehicle._id === selectedVehicle._id ? {...vehicle, status} : vehicle));

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
                title: 'Error', description: 'Failed to update vehicle status', variant: 'destructive'
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

    return (<div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Records</h1>
                <p className="text-gray-600 text-lg">View and manage all registered vehicles</p>
            </div>

            {/* Filters and Search Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
                <form onSubmit={handleSearch} className="flex gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by vehicle number or owner name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 h-11 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <Button
                        type="submit"
                        className="!w-[120px] bg-blue-600 hover:bg-blue-700 h-11 flex items-center justify-center rounded-lg text-white font-semibold"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <span>Search</span>
                        </div>
                    </Button>

                    {/* Vehicle Type Filter */}
                    <div className="min-w-[150px] flex-shrink-0">
                        <select
                            className="w-full h-11 border border-gray-300 rounded-md pl-3 pr-8 py-2 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            value={vehicleTypeFilter}
                            onChange={(e) => setVehicleTypeFilter(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="Car">Car</option>
                            <option value="Bike">Bike</option>
                            <option value="EV">EV</option>
                            <option value="Truck">Truck</option>
                            <option value="Bus">Bus</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-[120px] flex-shrink-0">
                        <select
                            className="w-full h-11 border border-gray-300 rounded-md pl-3 pr-8 py-2 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </form>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {loading ? (<div className="p-8 text-center">
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>) : vehicles.length === 0 ? (<div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <p className="text-gray-600">No vehicles found</p>
                </div>) : (<>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Make</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Model</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">License
                                    Plate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {vehicles.map((vehicle, index) => (<tr key={vehicle._id}
                                                                   className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {vehicle.userId?.fullName || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {vehicle.vehicleType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {vehicle.vehicleName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {vehicle.vehicleModel || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 bg-gray-50 rounded px-2 py-1">
                                    {vehicle.vehicleNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                        variant={getStatusBadgeVariant(vehicle.status || 'pending')}
                                        className="px-2 py-1 text-xs font-medium rounded-full"
                                    >
                                        {vehicle.status === 'approved' ? 'Active' : vehicle.status === 'rejected' ? 'Inactive' : 'Pending'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => openVehicleModal(vehicle)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                        </button>
                                        {vehicle.status === 'pending' && (<>
                                            <button
                                                onClick={() => openStatusDialog(vehicle, 'approve')}
                                                className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                                title="Approve"
                                            >
                                                <svg className="w-4 h-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openStatusDialog(vehicle, 'reject')}
                                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Reject"
                                            >
                                                <svg className="w-4 h-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </>)}
                                    </div>
                                </td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (<div className="bg-white px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing page {page} of {totalPages}
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {/* Page numbers */}
                                {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (<button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-2 text-sm font-medium rounded-md ${page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>);
                                })}

                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>)}
                </>)}
            </div>
        </div>

        {/* Vehicle Details Modal */}
        <Modal isOpen={modalOpen} onClose={closeModal} size="md">
            <ModalHeader>
                <ModalTitle>Vehicle Details</ModalTitle>
                <ModalCloseButton onClick={closeModal}/>
            </ModalHeader>
            <ModalBody>
                {selectedVehicle && (<div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle
                                Number</label>
                            <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">{selectedVehicle.vehicleNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.vehicleName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.vehicleType}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle
                                Model</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.vehicleModel || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle
                                Color</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.vehicleColor || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration
                                Date</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedVehicle.registrationDate)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.userId?.fullName || 'Unknown'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.userId?.email || 'Unknown'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
                            <p className="text-sm text-gray-900">{selectedVehicle.userId ? `${selectedVehicle.userId.wing}-${selectedVehicle.userId.flatNumber}` : 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registered
                                On</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedVehicle.createdAt)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Badge variant={getStatusBadgeVariant(selectedVehicle.status || 'pending')}>
                                {selectedVehicle.status || 'pending'}
                            </Badge>
                        </div>
                    </div>
                </div>)}
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
                        {statusAction === 'approve' ? 'Are you sure you want to approve this vehicle? This will allow the resident to use this vehicle in the society.' : 'Are you sure you want to reject this vehicle? This will prevent the resident from using this vehicle in the society.'}
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
                        {processingStatus ? (<>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                        </>) : statusAction === 'approve' ? ('Approve') : ('Reject')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>);
};

export default AdminVehicles;