import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  UsersIcon, 
  ExclamationTriangleIcon, 
  MegaphoneIcon, 
  TruckIcon,
  ClockIcon,
  CheckCircleIcon
} from '../../components/ui/Icons';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      const { stats, recentActivities } = response.data.data;
      setStats(stats);
      setRecentActivities(recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Residents',
      value: stats?.totalResidents || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingResidents || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Total Complaints',
      value: stats?.totalComplaints || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Pending Complaints',
      value: stats?.pendingComplaints || 0,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Active Notices',
      value: stats?.totalNotices || 0,
      icon: MegaphoneIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Registered Vehicles',
      value: stats?.totalVehicles || 0,
      icon: TruckIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Nivasa Society Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
            <CardDescription>Latest complaints from residents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities?.complaints?.length > 0 ? (
                recentActivities.complaints.map((complaint) => (
                  <div key={complaint._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {complaint.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {complaint.userId?.fullName}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge 
                          variant={
                            complaint.status === 'pending' ? 'warning' :
                            complaint.status === 'resolved' ? 'success' : 'info'
                          }
                        >
                          {complaint.status}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent complaints</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Residents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>Latest resident registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities?.residents?.length > 0 ? (
                recentActivities.residents.map((resident) => (
                  <div key={resident._id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <UsersIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resident.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {resident.email}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge 
                          variant={
                            resident.status === 'pending' ? 'warning' :
                            resident.status === 'approved' ? 'success' : 'error'
                          }
                        >
                          {resident.status}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(resident.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent registrations</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
