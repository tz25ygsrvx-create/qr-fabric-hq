import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { store, QuoteItem } from '@/data/warehouseStore';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Search, AlertTriangle } from 'lucide-react';

interface Line {
  item: QuoteItem;
  required_m: number;
  sku_code?: string;
  roll_id?: string;
  roll_remaining?: number;
  problem?: string;
}

const calcRequired = (i: QuoteItem) =>
  parseFloat((i.width_m * i.pleating_factor * i.height_m * i.qty).toFixed(2));

const FromQuotePage = () => {
  const warehouse = useWarehouseStore();
  const [quoteNumber, setQuoteNumber] = useState('');
  const [lines, setLines] = useState<Line[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const resolveLines = (items: QuoteItem[]): Line[] =>
    items.map(item => {
      const required_m = calcRequired(item);
      const sku = warehouse.skus.find(s => s.name.toLowerCase() === item.fabric_name.toLowerCase());
      if (!sku) {
        return { item, required_m, problem: `Audinys „${item.fabric_name}" nerastas sandėlyje` };
      }
      const candidates = warehouse.rolls
        .filter(r => r.sku_code === sku.sku_code && r.status === 'ACTIVE' && r.meters_remaining >= required_m)
        .sort((a, b) => a.meters_remaining - b.meters_remaining);
      const pick = candidates[0];
      if (!pick) {
        const total = warehouse.rolls
          .filter(r => r.sku_code === sku.sku_code && r.status === 'ACTIVE')
          .reduce((s, r) => s + r.meters_remaining, 0);
        return {
          item, required_m, sku_code: sku.sku_code,
          problem: `Nėra vieno rulono su ≥ ${required_m} m (laisva: ${total.toFixed(2)} m)`,
        };
      }
      return {
        item, required_m, sku_code: sku.sku_code,
        roll_id: pick.roll_id, roll_remaining: pick.meters_remaining,
      };
    });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = quoteNumber.trim();
    if (!num) return;
    setLoading(true);
    setDone(false);
    try {
      const items = await store.fetchQuoteItems(num);
      if (items.length === 0) {
        toast({ title: 'Nerasta', description: `Sąmata „${num}" be pozicijų`, variant: 'destructive' });
        setLines([]);
        return;
      }
      setLines(resolveLines(items));
    } finally {
      setLoading(false);
    }
  };

  const canConfirm = lines && lines.length > 0 && lines.every(l => l.roll_id);

  const handleConfirm = () => {
    if (!lines || !canConfirm) return;
    let ok = 0;
    for (const l of lines) {
      if (l.roll_id && warehouse.issueMeters(l.roll_id, l.required_m, quoteNumber, 'quote')) {
        ok++;
      }
    }
    toast({ title: 'Nurašyta', description: `${ok} / ${lines.length} pozicijų nurašyta iš sąmatos ${quoteNumber}` });
    setDone(true);
  };

  return (
    <MobileLayout title="Nurašyti iš sąmatos" showBack>
      <div className="px-4 py-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            value={quoteNumber}
            onChange={e => setQuoteNumber(e.target.value)}
            placeholder="SAM-2026-001"
            className="h-12 font-mono"
            disabled={loading}
          />
          <Button type="submit" className="h-12 px-4" disabled={loading}>
            <Search className="w-5 h-5" />
          </Button>
        </form>

        {done && (
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-[hsl(var(--success))]" />
            <div>
              <p className="font-bold">Sąmata įvykdyta</p>
              <p className="text-sm text-muted-foreground">{quoteNumber}</p>
            </div>
          </div>
        )}

        {lines && lines.length > 0 && !done && (
          <>
            <div className="space-y-2">
              {lines.map((l, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold">{l.item.fabric_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {l.item.width_m} × {l.item.height_m} m × {l.item.pleating_factor} klost. × {l.item.qty} vnt.
                      </p>
                    </div>
                    <p className="font-mono text-lg font-bold text-primary">{l.required_m} m</p>
                  </div>
                  {l.roll_id ? (
                    <div className="text-xs flex items-center gap-2 text-[hsl(var(--success))]">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-mono">{l.roll_id}</span>
                      <span className="text-muted-foreground">
                        (likę {l.roll_remaining?.toFixed(2)} m → liks {((l.roll_remaining || 0) - l.required_m).toFixed(2)} m)
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{l.problem}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full h-14 text-lg font-bold"
            >
              {canConfirm ? 'Patvirtinti nurašymą' : 'Yra neišspręstų pozicijų'}
            </Button>
          </>
        )}

        {lines && lines.length === 0 && !loading && (
          <p className="text-center text-muted-foreground text-sm">Pozicijų nėra</p>
        )}
      </div>
    </MobileLayout>
  );
};

export default FromQuotePage;
