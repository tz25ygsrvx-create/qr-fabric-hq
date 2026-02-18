import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import StatusBadge from '@/components/StatusBadge';
import MetersDisplay from '@/components/MetersDisplay';
import { getRollById, getSKUByCode, getLocationById, getLocationLabel, mockMovements } from '@/data/mockData';
import { Minus, ArrowRightLeft, Bookmark, BookmarkX, Printer, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RollDetail = () => {
  const { rollId } = useParams<{ rollId: string }>();
  const navigate = useNavigate();

  const roll = getRollById(rollId || '');
  if (!roll) {
    return (
      <MobileLayout title="Rulonas nerastas" showBack>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Rulonas „{rollId}" nerastas
        </div>
      </MobileLayout>
    );
  }

  const sku = getSKUByCode(roll.sku_code);
  const location = getLocationById(roll.location_id);
  const movements = mockMovements.filter(m => m.roll_id === roll.roll_id).sort((a, b) => b.datetime.localeCompare(a.datetime));

  const usedPercent = roll.meters_initial > 0 ? ((roll.meters_initial - roll.meters_remaining) / roll.meters_initial) * 100 : 0;

  const actions = [
    { icon: Minus, label: 'Nurašyti metrus', onClick: () => navigate(`/issue?roll=${roll.roll_id}`), disabled: roll.status === 'CONSUMED' },
    { icon: Minus, label: 'Nurašyti visą', onClick: () => {}, disabled: roll.status === 'CONSUMED' },
    { icon: ArrowRightLeft, label: 'Perkelti', onClick: () => navigate(`/move?roll=${roll.roll_id}`), disabled: roll.status === 'CONSUMED' },
    { icon: roll.status === 'RESERVED' ? BookmarkX : Bookmark, label: roll.status === 'RESERVED' ? 'Nuimti rezerv.' : 'Rezervuoti', onClick: () => {}, disabled: roll.status === 'CONSUMED' },
    { icon: Printer, label: 'Spausdinti etiketę', onClick: () => {} },
    { icon: Camera, label: 'Nuotrauka', onClick: () => {} },
  ];

  return (
    <MobileLayout title={`Rulonas ${roll.roll_id}`} showBack>
      <div className="px-4 py-4 space-y-4">
        {/* Header Card */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-sm text-muted-foreground">{roll.roll_id}</p>
              <h2 className="text-xl font-bold">{sku?.name || roll.sku_code}</h2>
              <p className="text-sm text-muted-foreground">{sku?.category} · {sku?.color}</p>
            </div>
            <StatusBadge status={roll.status} />
          </div>

          {roll.reserved_for_order && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
              <p className="text-xs text-primary font-medium">Rezervuotas užsakymui: <span className="font-mono">{roll.reserved_for_order}</span></p>
            </div>
          )}

          {/* Meters Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <MetersDisplay meters={roll.meters_remaining} label="Likutis" size="lg" />
              <MetersDisplay meters={roll.meters_initial} label="Pradiniai" size="sm" />
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${100 - usedPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">Sunaudota {usedPercent.toFixed(0)}%</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Lokacija</p>
          <p className="text-lg font-mono font-bold">
            {location ? getLocationLabel(location) : '—'}
          </p>
          {location?.notes && <p className="text-xs text-muted-foreground mt-1">{location.notes}</p>}
        </div>

        {/* Info */}
        <div className="bg-card rounded-xl border border-border p-4 grid grid-cols-2 gap-3 text-sm">
          {roll.supplier && (
            <div>
              <p className="text-xs text-muted-foreground">Tiekėjas</p>
              <p className="font-medium">{roll.supplier}</p>
            </div>
          )}
          {roll.received_date && (
            <div>
              <p className="text-xs text-muted-foreground">Gavimo data</p>
              <p className="font-medium">{roll.received_date}</p>
            </div>
          )}
          {sku?.width_cm && (
            <div>
              <p className="text-xs text-muted-foreground">Plotis</p>
              <p className="font-medium">{sku.width_cm} cm</p>
            </div>
          )}
          {sku?.collection && (
            <div>
              <p className="text-xs text-muted-foreground">Kolekcija</p>
              <p className="font-medium">{sku.collection}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          {actions.map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl p-3 text-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <action.icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium leading-tight">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Movements */}
        {movements.length > 0 && (
          <div>
            <h3 className="text-sm font-bold mb-2 text-muted-foreground uppercase tracking-wider">Paskutiniai judėjimai</h3>
            <div className="space-y-2">
              {movements.slice(0, 5).map(m => (
                <div key={m.id} className="bg-card border border-border rounded-lg px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{m.type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.datetime).toLocaleDateString('lt-LT')} · {m.order_no || m.note || ''}
                    </p>
                  </div>
                  {m.qty_meters !== 0 && (
                    <span className={`font-mono font-bold text-sm ${m.qty_meters < 0 ? 'text-destructive' : 'text-[hsl(var(--success))]'}`}>
                      {m.qty_meters > 0 ? '+' : ''}{m.qty_meters.toFixed(2)} m
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default RollDetail;
