import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ResidentProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and edit your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Profile management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentProfile;
