import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import StatusBadge from '@/components/StatusBadge';
import { getSKUByCode, getLocationById, getLocationLabel } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';

const RollsListPage = () => {
  const navigate = useNavigate();
  const warehouse = useWarehouseStore();

  // Group rolls by SKU
  const skuGroups = warehouse.rolls.reduce((acc, roll) => {
    if (!acc[roll.sku_code]) acc[roll.sku_code] = [];
    acc[roll.sku_code].push(roll);
    return acc;
  }, {} as Record<string, typeof warehouse.rolls>);

  const activeRolls = warehouse.rolls.filter(r => r.status !== 'CONSUMED');

  return (
    <MobileLayout title={`Visi rulonai (${activeRolls.length})`} showBack>
      <div className="px-4 py-4 space-y-4">
        {Object.entries(skuGroups).map(([skuCode, rolls]) => {
          const sku = getSKUByCode(skuCode);
          const active = rolls.filter(r => r.status !== 'CONSUMED');
          const totalMeters = active.reduce((s, r) => s + r.meters_remaining, 0);

          return (
            <div key={skuCode}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-bold text-sm">{sku?.name || skuCode}</p>
                  <p className="text-xs text-muted-foreground">{skuCode}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">{active.length} <span className="text-xs text-muted-foreground">rul.</span></p>
                  <p className="text-xs text-muted-foreground">{totalMeters.toFixed(0)} m</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {rolls.map(roll => {
                  const loc = getLocationById(roll.location_id);
                  return (
                    <button
                      key={roll.roll_id}
                      onClick={() => navigate(`/roll/${roll.roll_id}`)}
                      className="w-full bg-card border border-border rounded-xl p-3 flex items-center justify-between hover:bg-secondary transition-colors text-left"
                    >
                      <div>
                        <p className="font-mono font-bold text-sm">{roll.roll_id}</p>
                        <p className="text-xs text-muted-foreground">{loc ? getLocationLabel(loc) : '—'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{roll.meters_remaining.toFixed(2)} m</span>
                        <StatusBadge status={roll.status} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </MobileLayout>
  );
};

export default RollsListPage;
