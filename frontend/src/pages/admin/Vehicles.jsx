import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const AdminVehicles = () => {
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
          <p className="text-gray-500">Vehicle management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVehicles;
