import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { mockLocations, getLocationLabel } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AddRollPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = useWarehouseStore();
  const [rollId, setRollId] = useState('');
  const [skuCode, setSkuCode] = useState(searchParams.get('sku') || '');
  const [metersInitial, setMetersInitial] = useState('');
  const [locationId, setLocationId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meters = parseFloat(metersInitial);
    if (isNaN(meters) || meters <= 0) {
      toast({ title: 'Klaida', description: 'Įveskite teisingą metrų kiekį', variant: 'destructive' });
      return;
    }
    if (store.getRollById(rollId.trim())) {
      toast({ title: 'Klaida', description: `Rulonas „${rollId}" jau egzistuoja`, variant: 'destructive' });
      return;
    }
    store.addRoll({
      roll_id: rollId.trim(),
      sku_code: skuCode,
      qr_code_value: `QR-${rollId.trim()}`,
      meters_initial: meters,
      meters_remaining: meters,
      location_id: locationId,
      status: 'ACTIVE',
      received_date: new Date().toISOString().slice(0, 10),
      supplier: supplier || undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MobileLayout title="Naujas rulonas" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
          <CheckCircle className="w-16 h-16 text-[hsl(var(--success))]" />
          <p className="text-xl font-bold">Rulonas pridėtas!</p>
          <p className="text-muted-foreground font-mono">{rollId}</p>
          <div className="flex gap-3 w-full max-w-sm">
            <Button variant="outline" className="flex-1" onClick={() => skuCode ? navigate(`/sku/${skuCode}`) : navigate('/')}>Grįžti</Button>
            <Button className="flex-1" onClick={() => { setSubmitted(false); setRollId(''); setMetersInitial(''); }}>Dar vienas</Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Pridėti ruloną" showBack>
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Roll ID *</label>
          <Input value={rollId} onChange={e => setRollId(e.target.value)} placeholder="R-00009" className="h-12 font-mono" required />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">SKU *</label>
          <select
            value={skuCode}
            onChange={e => setSkuCode(e.target.value)}
            className="w-full h-12 rounded-lg border border-input bg-card px-3 text-sm"
            required
          >
            <option value="">Pasirinkite audinį...</option>
            {store.getSKUs().map(sku => (
              <option key={sku.sku_code} value={sku.sku_code}>{sku.sku_code} — {sku.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Pradiniai metrai *</label>
          <Input type="number" step="0.01" value={metersInitial} onChange={e => setMetersInitial(e.target.value)} placeholder="50.00" className="h-14 font-mono text-2xl text-center" required />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Lokacija *</label>
          <select
            value={locationId}
            onChange={e => setLocationId(e.target.value)}
            className="w-full h-12 rounded-lg border border-input bg-card px-3 text-sm"
            required
          >
            <option value="">Pasirinkite lokaciją...</option>
            {mockLocations.map(loc => (
              <option key={loc.id} value={loc.id}>{getLocationLabel(loc)}{loc.notes ? ` (${loc.notes})` : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Tiekėjas</label>
          <Input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Audiniai UAB" className="h-12" />
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold">
          Pridėti ruloną
        </Button>
      </form>
    </MobileLayout>
  );
};

export default AddRollPage;
