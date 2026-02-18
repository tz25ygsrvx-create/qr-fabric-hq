import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import StatusBadge from '@/components/StatusBadge';
import { mockRolls, getSKUByCode, getLocationById, getLocationLabel } from '@/data/mockData';

const RollsListPage = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout title="Visi rulonai" showBack>
      <div className="px-4 py-4 space-y-2">
        {mockRolls.map(roll => {
          const sku = getSKUByCode(roll.sku_code);
          const loc = getLocationById(roll.location_id);
          return (
            <button
              key={roll.roll_id}
              onClick={() => navigate(`/roll/${roll.roll_id}`)}
              className="w-full bg-card border border-border rounded-xl p-3 flex items-center justify-between hover:bg-secondary transition-colors text-left"
            >
              <div>
                <p className="font-mono font-bold text-sm">{roll.roll_id}</p>
                <p className="text-sm">{sku?.name || roll.sku_code}</p>
                <p className="text-xs text-muted-foreground">{loc ? getLocationLabel(loc) : '—'}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono font-bold">{roll.meters_remaining.toFixed(2)} m</span>
                <StatusBadge status={roll.status} />
              </div>
            </button>
          );
        })}
      </div>
    </MobileLayout>
  );
};

export default RollsListPage;
