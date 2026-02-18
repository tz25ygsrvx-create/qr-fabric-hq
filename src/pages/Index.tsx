import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ScanLine, Minus, Plus, Search, Package, MapPin, BarChart3 } from 'lucide-react';
import { mockRolls, mockSKUs } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  const activeRolls = mockRolls.filter(r => r.status === 'ACTIVE').length;
  const reservedRolls = mockRolls.filter(r => r.status === 'RESERVED').length;
  const totalMeters = mockRolls.filter(r => r.status !== 'CONSUMED').reduce((sum, r) => sum + r.meters_remaining, 0);
  const skuCount = mockSKUs.length;

  const mainActions = [
    { icon: ScanLine, label: 'SCAN ROLL', desc: 'Nuskenuoti QR', path: '/scan', accent: true },
    { icon: Minus, label: 'NURAŠYTI', desc: 'Išduoti metrus', path: '/issue' },
    { icon: Plus, label: 'PAPILDYTI', desc: 'Pridėti ruloną', path: '/add-roll' },
    { icon: Search, label: 'PAIEŠKA', desc: 'Rasti audinį', path: '/sku' },
  ];

  return (
    <MobileLayout>
      {/* Hero */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-extrabold">Audinių sandėlis</h1>
        <p className="text-muted-foreground text-sm mt-1">Warehouse Management System</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-2 gap-2 mb-6">
        {[
          { label: 'Aktyvūs rulonai', value: activeRolls, color: 'text-[hsl(var(--success))]' },
          { label: 'Rezervuoti', value: reservedRolls, color: 'text-primary' },
          { label: 'Viso metrų', value: `${totalMeters.toFixed(0)} m`, color: 'text-foreground' },
          { label: 'SKU tipai', value: skuCount, color: 'text-[hsl(var(--info))]' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div className="warehouse-grid">
        {mainActions.map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`big-button ${
              action.accent
                ? 'bg-primary text-primary-foreground border-primary animate-pulse-glow'
                : 'bg-card text-card-foreground hover:bg-secondary'
            }`}
          >
            <action.icon className="w-8 h-8" />
            <span className="text-base font-bold">{action.label}</span>
            <span className={`text-xs ${action.accent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{action.desc}</span>
          </button>
        ))}
      </div>

      {/* Quick Links */}
      <div className="px-4 mt-4 space-y-2">
        {[
          { icon: MapPin, label: 'Lokacijos', path: '/locations' },
          { icon: Package, label: 'Visi rulonai', path: '/rolls' },
          { icon: BarChart3, label: 'Judėjimų žurnalas', path: '/reports' },
        ].map(link => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:bg-secondary transition-colors"
          >
            <link.icon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
