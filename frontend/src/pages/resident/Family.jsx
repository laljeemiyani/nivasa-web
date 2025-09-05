import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ResidentFamily = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
        <p className="text-gray-600">Manage your family member information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
          <CardDescription>Add and manage family member details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Family member management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentFamily;
