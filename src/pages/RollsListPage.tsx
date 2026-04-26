import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import StatusBadge from '@/components/StatusBadge';
import { getLocationById, getLocationLabel } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SortKey = 'name' | 'category' | 'rolls' | 'meters';

const RollsListPage = () => {
  const navigate = useNavigate();
  const warehouse = useWarehouseStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('Visos');
  const [sortKey, setSortKey] = useState<SortKey>('name');

  const categories = ['Visos', ...warehouse.getCategories()];
  const activeRolls = warehouse.rolls.filter(r => r.status !== 'CONSUMED');

  const groups = useMemo(() => {
    const map = warehouse.rolls.reduce((acc, roll) => {
      if (!acc[roll.sku_code]) acc[roll.sku_code] = [];
      acc[roll.sku_code].push(roll);
      return acc;
    }, {} as Record<string, typeof warehouse.rolls>);

    let entries = Object.entries(map).map(([skuCode, rolls]) => {
      const sku = warehouse.getSKUByCode(skuCode);
      const active = rolls.filter(r => r.status !== 'CONSUMED');
      const totalMeters = active.reduce((s, r) => s + r.meters_remaining, 0);
      return { skuCode, sku, rolls, active, totalMeters };
    });

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      entries = entries.filter(g =>
        g.skuCode.toLowerCase().includes(q) ||
        (g.sku?.name || '').toLowerCase().includes(q) ||
        (g.sku?.color || '').toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCat !== 'Visos') {
      entries = entries.filter(g => g.sku?.category === selectedCat);
    }

    // Sort
    entries.sort((a, b) => {
      switch (sortKey) {
        case 'name': return (a.sku?.name || a.skuCode).localeCompare(b.sku?.name || b.skuCode);
        case 'category': return (a.sku?.category || '').localeCompare(b.sku?.category || '');
        case 'rolls': return b.active.length - a.active.length;
        case 'meters': return b.totalMeters - a.totalMeters;
      }
    });

    return entries;
  }, [warehouse.rolls, warehouse.skus, search, selectedCat, sortKey]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Pavadinimas' },
    { key: 'category', label: 'Rūšis' },
    { key: 'rolls', label: 'Rulonų sk.' },
    { key: 'meters', label: 'Metrai' },
  ];

  return (
    <MobileLayout title={`Visi rulonai (${activeRolls.length})`} showBack>
      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Ieškoti pagal pavadinimą, kodą, spalvą..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Rikiuoti:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  sortKey === opt.key ? 'bg-secondary text-secondary-foreground border border-primary' : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Groups */}
        {groups.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">Nieko nerasta</p>
        )}
        {groups.map(({ skuCode, sku, rolls, active, totalMeters }) => (
          <div key={skuCode}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-sm">{sku?.name || skuCode}</p>
                <p className="text-xs text-muted-foreground">{skuCode}{sku?.category ? ` · ${sku.category}` : ''}</p>
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
        ))}
      </div>
    </MobileLayout>
  );
};

export default RollsListPage;
