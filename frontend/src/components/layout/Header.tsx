import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/cn';

const Header = () => {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Patients', href: '/patients', icon: '👥' },
    { name: 'Medications', href: '/medications', icon: '💊' },
    { name: 'Assignments', href: '/assignments', icon: '📋' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Oxyera</span>
              <span className="text-sm text-gray-500">Med Tracker</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Medical Dashboard
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
