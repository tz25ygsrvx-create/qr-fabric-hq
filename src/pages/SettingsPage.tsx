import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ListKind = 'type' | 'category';

const EditableList = ({
  title,
  items,
  usedBy,
  onAdd,
  onRename,
  onDelete,
}: {
  title: string;
  items: string[];
  usedBy: (name: string) => number;
  onAdd: (name: string) => boolean;
  onRename: (oldName: string, newName: string) => boolean;
  onDelete: (name: string) => boolean;
}) => {
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  const handleAdd = () => {
    if (!newVal.trim()) return;
    if (!onAdd(newVal.trim())) {
      toast({ title: 'Klaida', description: 'Toks įrašas jau egzistuoja', variant: 'destructive' });
      return;
    }
    setNewVal(''); setAdding(false);
  };

  const handleRename = (oldName: string) => {
    if (!editVal.trim() || editVal.trim() === oldName) { setEditing(null); return; }
    if (!onRename(oldName, editVal.trim())) {
      toast({ title: 'Klaida', description: 'Toks pavadinimas jau egzistuoja', variant: 'destructive' });
      return;
    }
    setEditing(null);
    toast({ title: 'Pervadinta' });
  };

  const handleDelete = (name: string) => {
    const count = usedBy(name);
    if (count > 0) {
      toast({ title: 'Negalima ištrinti', description: `Naudojama ${count} audinyje (-iuose)`, variant: 'destructive' });
      return;
    }
    if (!confirm(`Ištrinti „${name}"?`)) return;
    onDelete(name);
    toast({ title: 'Ištrinta' });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item} className="flex items-center gap-2">
            {editing === item ? (
              <>
                <Input
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  className="h-10 flex-1"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRename(item);
                    if (e.key === 'Escape') setEditing(null);
                  }}
                />
                <button onClick={() => handleRename(item)} className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditing(null)} className="p-2 rounded-lg bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 px-3 py-2 bg-background border border-border rounded-lg flex items-center justify-between">
                  <span className="font-medium">{item}</span>
                  <span className="text-xs text-muted-foreground">{usedBy(item)} naud.</span>
                </div>
                <button
                  onClick={() => { setEditing(item); setEditVal(item); }}
                  className="p-2 rounded-lg bg-muted hover:bg-secondary"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg bg-muted hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}

        {adding ? (
          <div className="flex items-center gap-2">
            <Input
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              placeholder="Naujas pavadinimas..."
              className="h-10 flex-1"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') { setAdding(false); setNewVal(''); }
              }}
            />
            <button onClick={handleAdd} className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => { setAdding(false); setNewVal(''); }} className="p-2 rounded-lg bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-primary/40 text-primary font-medium hover:bg-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" /> Pridėti
          </button>
        )}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const store = useWarehouseStore();

  return (
    <MobileLayout title="Nustatymai" showBack>
      <div className="px-4 py-4 space-y-4">
        <EditableList
          title="Tipai"
          items={store.getTypes()}
          usedBy={(name) => store.skus.filter(s => s.type === name).length}
          onAdd={(n) => store.addType(n)}
          onRename={(o, n) => store.renameType(o, n)}
          onDelete={(n) => store.deleteType(n)}
        />
        <EditableList
          title="Rūšys"
          items={store.getCategories()}
          usedBy={(name) => store.skus.filter(s => s.category === name).length}
          onAdd={(n) => store.addCategory(n)}
          onRename={(o, n) => store.renameCategory(o, n)}
          onDelete={(n) => store.deleteCategory(n)}
        />
        <p className="text-xs text-muted-foreground text-center pt-2">
          Ištrinti galima tik tuos įrašus, kurie nenaudojami jokiame audinyje.
        </p>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
