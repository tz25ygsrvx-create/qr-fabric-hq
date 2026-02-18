import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import StatusBadge from '@/components/StatusBadge';
import { getLocationById, getLocationLabel } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SKUDetail = () => {
  const { skuCode } = useParams<{ skuCode: string }>();
  const navigate = useNavigate();
  const store = useWarehouseStore();
  const sku = store.getSKUByCode(skuCode || '');

  if (!sku) {
    return (
      <MobileLayout title="SKU nerastas" showBack>
        <div className="flex items-center justify-center h-64 text-muted-foreground">SKU „{skuCode}" nerastas</div>
      </MobileLayout>
    );
  }

  const rolls = store.rolls.filter(r => r.sku_code === sku.sku_code);
  const activeRolls = rolls.filter(r => r.status !== 'CONSUMED');
  const totalMeters = activeRolls.reduce((s, r) => s + r.meters_remaining, 0);

  const handleDelete = () => {
    if (rolls.length > 0) {
      toast({ title: 'Negalima ištrinti', description: `SKU turi ${rolls.length} rulon(ų). Pirmiausia pašalinkite rulonus.`, variant: 'destructive' });
      return;
    }
    if (confirm('Ar tikrai norite ištrinti šį SKU?')) {
      store.deleteSKU(sku.sku_code);
      toast({ title: 'SKU ištrintas' });
      navigate('/sku');
    }
  };

  return (
    <MobileLayout title={sku.name} showBack>
      <div className="px-4 py-4 space-y-4">
        {/* Info */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-sm text-muted-foreground">{sku.sku_code}</p>
              <h2 className="text-xl font-bold">{sku.name}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/sku/${sku.sku_code}/edit`)} className="p-2 rounded-lg bg-secondary text-foreground"><Pencil className="w-5 h-5" /></button>
              <button onClick={handleDelete} className="p-2 rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-muted-foreground">Kategorija</p><p className="font-medium">{sku.category}</p></div>
            {sku.color && <div><p className="text-xs text-muted-foreground">Spalva</p><p className="font-medium">{sku.color}</p></div>}
            {sku.width_cm && <div><p className="text-xs text-muted-foreground">Plotis</p><p className="font-medium">{sku.width_cm} cm</p></div>}
            {sku.collection && <div><p className="text-xs text-muted-foreground">Kolekcija</p><p className="font-medium">{sku.collection}</p></div>}
          </div>
          <div className="flex gap-4 pt-2 border-t border-border">
            <div><p className="text-xs text-muted-foreground">Viso metrų</p><p className="font-mono font-bold text-2xl">{totalMeters.toFixed(2)} <span className="text-sm text-muted-foreground">m</span></p></div>
            <div><p className="text-xs text-muted-foreground">Rulonų</p><p className="font-mono font-bold text-2xl">{activeRolls.length}</p></div>
          </div>
        </div>

        {/* Rolls */}
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rulonai</h3>
        <div className="space-y-2">
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
    </MobileLayout>
  );
};

export default SKUDetail;
