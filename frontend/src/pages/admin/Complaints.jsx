import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const AdminComplaints = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
        <p className="text-gray-600">Manage and resolve resident complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>View and manage all resident complaints</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complaint management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminComplaints;
