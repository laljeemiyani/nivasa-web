import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const AdminNotices = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
        <p className="text-gray-600">Create and manage society notices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notices</CardTitle>
          <CardDescription>Create, edit, and manage society notices</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Notice management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotices;
