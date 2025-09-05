import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const AdminResidents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resident Management</h1>
        <p className="text-gray-600">Manage resident registrations and approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Residents</CardTitle>
          <CardDescription>View and manage all resident registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Resident management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResidents;
