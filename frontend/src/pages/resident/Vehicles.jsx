import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ResidentVehicles = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
        <p className="text-gray-600">Manage your registered vehicles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>Add, edit, and manage your vehicle information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Vehicle management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentVehicles;
