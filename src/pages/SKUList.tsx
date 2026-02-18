import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockSKUs } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { FabricCategory } from '@/types/warehouse';



const SKUList = () => {
  const navigate = useNavigate();
  const store = useWarehouseStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<FabricCategory | 'Visos'>('Visos');

  const allSKUs = store.getSKUs();
  const categories: string[] = ['Visos', ...store.getCategories()];

  const filtered = allSKUs.filter(sku => {
    const matchesSearch = !search || sku.name.toLowerCase().includes(search.toLowerCase()) || sku.sku_code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'Visos' || sku.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const getRollCount = (skuCode: string) => store.rolls.filter(r => r.sku_code === skuCode && r.status !== 'CONSUMED').length;
  const getTotalMeters = (skuCode: string) => store.rolls.filter(r => r.sku_code === skuCode && r.status !== 'CONSUMED').reduce((s, r) => s + r.meters_remaining, 0);

  return (
    <MobileLayout title="Audiniai (SKU)">
      <div className="px-4 py-4 space-y-4">
        {/* Add + Search */}
        <button
          onClick={() => navigate('/sku/new')}
          className="w-full bg-primary text-primary-foreground rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-lg"
        >
          <Plus className="w-5 h-5" /> Naujas SKU
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Ieškoti pagal pavadinimą ar SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Category Filter */}
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

        {/* List */}
        <div className="space-y-2">
          {filtered.map(sku => (
            <button
              key={sku.sku_code}
              onClick={() => navigate(`/sku/${sku.sku_code}`)}
              className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:bg-secondary transition-colors text-left"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground">{sku.sku_code}</p>
                <p className="font-bold">{sku.name}</p>
                <p className="text-sm text-muted-foreground">{sku.category}{sku.color ? ` · ${sku.color}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-lg">{getTotalMeters(sku.sku_code).toFixed(0)}<span className="text-xs text-muted-foreground ml-0.5">m</span></p>
                <p className="text-xs text-muted-foreground">{getRollCount(sku.sku_code)} rul.</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SKUList;
