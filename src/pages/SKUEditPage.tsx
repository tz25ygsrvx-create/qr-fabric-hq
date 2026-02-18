import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { FabricCategory, FabricSKU } from '@/types/warehouse';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const SKUEditPage = () => {
  const { skuCode } = useParams<{ skuCode: string }>();
  const navigate = useNavigate();
  const store = useWarehouseStore();
  const isNew = skuCode === 'new';
  const existing = isNew ? null : store.getSKUByCode(skuCode || '');

  const [form, setForm] = useState({
    sku_code: '',
    name: '',
    category: 'Dieniniai' as FabricCategory,
    width_cm: '',
    color: '',
    collection: '',
    notes: '',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        sku_code: existing.sku_code,
        name: existing.name,
        category: existing.category,
        width_cm: existing.width_cm?.toString() || '',
        color: existing.color || '',
        collection: existing.collection || '',
        notes: existing.notes || '',
      });
    }
  }, [existing]);

  if (!isNew && !existing) {
    return (
      <MobileLayout title="SKU nerastas" showBack>
        <div className="flex items-center justify-center h-64 text-muted-foreground">SKU „{skuCode}" nerastas</div>
      </MobileLayout>
    );
  }

  const handleSave = () => {
    if (!form.sku_code.trim() || !form.name.trim()) {
      toast({ title: 'Klaida', description: 'SKU kodas ir pavadinimas privalomi', variant: 'destructive' });
      return;
    }

    const skuData: FabricSKU = {
      sku_code: form.sku_code.trim(),
      name: form.name.trim(),
      category: form.category,
      width_cm: form.width_cm ? Number(form.width_cm) : undefined,
      color: form.color || undefined,
      collection: form.collection || undefined,
      notes: form.notes || undefined,
    };

    if (isNew) {
      const ok = store.addSKU(skuData);
      if (!ok) {
        toast({ title: 'Klaida', description: `SKU kodas „${skuData.sku_code}" jau egzistuoja`, variant: 'destructive' });
        return;
      }
      toast({ title: 'SKU sukurtas', description: skuData.name });
      navigate(`/sku/${skuData.sku_code}`);
    } else {
      store.updateSKU(skuCode!, {
        name: skuData.name,
        category: skuData.category,
        width_cm: skuData.width_cm,
        color: skuData.color,
        collection: skuData.collection,
        notes: skuData.notes,
      });
      toast({ title: 'SKU atnaujintas', description: skuData.name });
      navigate(`/sku/${skuCode}`);
    }
  };

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <MobileLayout title={isNew ? 'Naujas SKU' : 'Redaguoti SKU'} showBack>
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium">SKU kodas *</label>
            <Input
              value={form.sku_code}
              onChange={e => set('sku_code', e.target.value)}
              placeholder="pvz. DN-003"
              className="h-12 font-mono"
              disabled={!isNew}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Pavadinimas *</label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="pvz. Linas Natūralus" className="h-12" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Kategorija</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {store.getCategories().map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => set('category', cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.category === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <AddCategoryInline onAdd={(name) => {
                store.addCategory(name);
                set('category', name);
              }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground font-medium">Plotis (cm)</label>
              <Input type="number" value={form.width_cm} onChange={e => set('width_cm', e.target.value)} placeholder="300" className="h-12" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium">Spalva</label>
              <Input value={form.color} onChange={e => set('color', e.target.value)} placeholder="Balta" className="h-12" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Kolekcija</label>
            <Input value={form.collection} onChange={e => set('collection', e.target.value)} placeholder="2025 Pavasaris" className="h-12" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium">Pastabos</label>
            <Input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Papildoma informacija..." className="h-12" />
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-primary text-primary-foreground rounded-xl p-4 font-bold text-lg">
          {isNew ? '✓ Sukurti SKU' : '✓ Išsaugoti pakeitimus'}
        </button>
      </div>
    </MobileLayout>
  );
};
// Inline component to add a new category
const AddCategoryInline = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-full text-sm font-medium border-2 border-dashed border-primary/40 text-primary flex items-center gap-1 hover:bg-primary/10 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Nauja
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Kategorija..."
        className="h-8 w-32 text-sm"
        autoFocus
        onKeyDown={e => {
          if (e.key === 'Enter' && value.trim()) { onAdd(value.trim()); setOpen(false); setValue(''); }
          if (e.key === 'Escape') { setOpen(false); setValue(''); }
        }}
      />
      <button
        type="button"
        onClick={() => { if (value.trim()) { onAdd(value.trim()); setOpen(false); setValue(''); } }}
        className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
      >
        ✓
      </button>
      <button
        type="button"
        onClick={() => { setOpen(false); setValue(''); }}
        className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs"
      >
        ✕
      </button>
    </div>
  );
};

export default SKUEditPage;
