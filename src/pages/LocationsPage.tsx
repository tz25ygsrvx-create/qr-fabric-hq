import MobileLayout from '@/components/MobileLayout';
import { mockLocations, mockRolls, getLocationLabel } from '@/data/mockData';

const LocationsPage = () => {
  const getLocRollCount = (locId: string) => mockRolls.filter(r => r.location_id === locId && r.status !== 'CONSUMED').length;
  const getLocMeters = (locId: string) => mockRolls.filter(r => r.location_id === locId && r.status !== 'CONSUMED').reduce((s, r) => s + r.meters_remaining, 0);

  // Group by rack
  const racks = [...new Set(mockLocations.map(l => l.rack))].sort();

  return (
    <MobileLayout title="Lokacijos" showBack>
      <div className="px-4 py-4 space-y-6">
        {racks.map(rack => (
          <div key={rack}>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Stelažas {rack}</h3>
            <div className="space-y-2">
              {mockLocations.filter(l => l.rack === rack).map(loc => (
                <div key={loc.id} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold">{getLocationLabel(loc)}</p>
                    {loc.notes && <p className="text-xs text-muted-foreground">{loc.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold">{getLocMeters(loc.id).toFixed(0)} <span className="text-xs text-muted-foreground">m</span></p>
                    <p className="text-xs text-muted-foreground">{getLocRollCount(loc.id)} rul.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default LocationsPage;
