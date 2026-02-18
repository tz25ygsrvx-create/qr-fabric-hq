import MobileLayout from '@/components/MobileLayout';
import { mockMovements, getRollById, getSKUByCode } from '@/data/mockData';

const typeLabels: Record<string, string> = {
  ADD_ROLL: 'Pridėtas rulonas',
  ADD_METERS: 'Pridėti metrai',
  ISSUE_METERS: 'Nurašyti metrai',
  ISSUE_ROLL: 'Nurašytas rulonas',
  MOVE: 'Perkeltas',
  ADJUST: 'Korekcija',
  RETURN: 'Grąžinimas',
  RESERVE: 'Rezervuotas',
  UNRESERVE: 'Rezerv. nuimta',
};

const ReportsPage = () => {
  const sorted = [...mockMovements].sort((a, b) => b.datetime.localeCompare(a.datetime));

  return (
    <MobileLayout title="Judėjimų žurnalas">
      <div className="px-4 py-4 space-y-2">
        {sorted.map(m => {
          const sku = getSKUByCode(m.sku_code);
          return (
            <div key={m.id} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{typeLabels[m.type] || m.type}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{m.roll_id}</span> · {sku?.name || m.sku_code}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.datetime).toLocaleDateString('lt-LT')} {new Date(m.datetime).toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' })}
                    {m.order_no ? ` · ${m.order_no}` : ''}
                  </p>
                  {m.note && <p className="text-xs text-muted-foreground italic mt-0.5">{m.note}</p>}
                </div>
                {m.qty_meters !== 0 && (
                  <span className={`font-mono font-bold text-sm ${m.qty_meters < 0 ? 'text-destructive' : 'text-[hsl(var(--success))]'}`}>
                    {m.qty_meters > 0 ? '+' : ''}{m.qty_meters.toFixed(2)} m
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </MobileLayout>
  );
};

export default ReportsPage;
