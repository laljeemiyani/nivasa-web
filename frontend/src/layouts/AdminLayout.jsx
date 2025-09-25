import {useState} from 'react';
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    ExclamationTriangleIcon,
    HomeIcon,
    MegaphoneIcon,
    TruckIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon
} from '../components/ui/Icons';
import NotificationBell from '../components/NotificationBell';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {user, logout} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        {name: 'Dashboard', href: '/admin', icon: HomeIcon},
        {name: 'Residents', href: '/admin/residents', icon: UsersIcon},
        {name: 'Complaints', href: '/admin/complaints', icon: ExclamationTriangleIcon},
        {name: 'Notices', href: '/admin/notices', icon: MegaphoneIcon},
        {name: 'Vehicles', href: '/admin/vehicles', icon: TruckIcon},
        {name: 'Notifications', href: '/admin/notifications', icon: MegaphoneIcon},
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (href) => {
        if (href === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}/>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex items-center">
                            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">N</span>
                            </div>
                            <span className="ml-2 text-lg font-semibold text-gray-900">Nivasa</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6"/>
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="mr-3 h-5 w-5"/>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4">
                        <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">N</span>
                        </div>
                        <span className="ml-2 text-lg font-semibold text-gray-900">Nivasa Admin</span>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5"/>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div
                    className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6"/>
                    </button>

                    <div className="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
                        {/* Notification Bell */}
                        <NotificationBell/>

                        {/* User menu */}
                        <div className="flex items-center gap-x-2">
                            {user?.profilePhoto ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/uploads/profile_photos/${user.profilePhoto}`}
                                    alt="Profile"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <UserCircleIcon className="h-8 w-8 text-gray-400"/>
                            )}
                            <div className="hidden lg:block">
                                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5"/>
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
