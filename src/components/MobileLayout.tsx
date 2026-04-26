import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanLine, Package, BarChart3, ArrowLeft } from 'lucide-react';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
}

const navItems = [
  { path: '/', icon: Home, label: 'Pradžia' },
  { path: '/scan', icon: ScanLine, label: 'Scan' },
  { path: '/sku', icon: Package, label: 'Audiniai' },
  { path: '/reports', icon: BarChart3, label: 'Ataskaitos' },
];

const MobileLayout = ({ children, title, showBack = false, showNav = true }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {title && (
        <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-lg font-bold truncate">{title}</h1>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
