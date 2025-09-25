import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {AuthProvider, useAuth} from './context/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import ResidentLayout from './layouts/ResidentLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminResidents from './pages/admin/Residents';
import AdminComplaints from './pages/admin/Complaints';
import AdminNotices from './pages/admin/Notices';
import AdminNotifications from './pages/admin/Notifications';
import AdminVehicles from './pages/admin/Vehicles';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentProfile from './pages/resident/Profile';
import ResidentComplaints from './pages/resident/Complaints';
import ResidentNotices from './pages/resident/Notices';
import ResidentNotifications from './pages/resident/Notifications';
import ResidentFamily from './pages/resident/Family';
import ResidentVehicles from './pages/resident/Vehicles';
import ComponentShowcase from './pages/ComponentShowcase';

// Protected Route Component
const ProtectedRoute = ({children, requiredRole}) => {
    const {isAuthenticated, user, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace/>;
    }

    return children;
};

// Main App Component
function AppContent() {
    const {isAuthenticated, user} = useAuth();

    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to={user.role === 'admin' ? '/admin' : '/resident'} replace/> :
                        <AuthLayout isLogin={true}/>
                }/>
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to={user.role === 'admin' ? '/admin' : '/resident'} replace/> :
                        <AuthLayout isLogin={false}/>
                }/>

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminLayout/>
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboard/>}/>
                    <Route path="residents" element={<AdminResidents/>}/>
                    <Route path="complaints" element={<AdminComplaints/>}/>
                    <Route path="notices" element={<AdminNotices/>}/>
                    <Route path="vehicles" element={<AdminVehicles/>}/>
                    <Route path="notifications" element={<AdminNotifications/>}/>
                </Route>

                {/* Resident Routes */}
                <Route path="/resident" element={
                    <ProtectedRoute requiredRole="resident">
                        <ResidentLayout/>
                    </ProtectedRoute>
                }>
                    <Route index element={<ResidentDashboard/>}/>
                    <Route path="profile" element={<ResidentProfile/>}/>
                    <Route path="complaints" element={<ResidentComplaints/>}/>
                    <Route path="notices" element={<ResidentNotices/>}/>
                    <Route path="notifications" element={<ResidentNotifications/>}/>
                    <Route path="family" element={<ResidentFamily/>}/>
                    <Route path="vehicles" element={<ResidentVehicles/>}/>
                </Route>

                {/* UI Component Showcase */}
                <Route path="/components" element={<ComponentShowcase/>}/>

                {/* Default redirect */}
                <Route path="/" element={
                    isAuthenticated ?
                        <Navigate to={user.role === 'admin' ? '/admin' : '/resident'} replace/> :
                        <Navigate to="/login" replace/>
                }/>

                {/* Unauthorized */}
                <Route path="/unauthorized" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                            <p className="text-gray-600">You don't have permission to access this page.</p>
                        </div>
                    </div>
                }/>

                {/* 404 */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                        </div>
                    </div>
                }/>
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-background">
                <AppContent/>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </AuthProvider>
    );
}

export default App;
