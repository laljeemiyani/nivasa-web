import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const ResidentComplaints = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
        <p className="text-gray-600">Submit and track your complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaints</CardTitle>
          <CardDescription>Submit new complaints and track existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Complaint functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentComplaints;
