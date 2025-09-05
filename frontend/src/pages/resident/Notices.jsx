import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ResidentNotices = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Society Notices</h1>
        <p className="text-gray-600">View all society announcements and notices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notices</CardTitle>
          <CardDescription>View all society notices and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Notice viewing functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentNotices;
