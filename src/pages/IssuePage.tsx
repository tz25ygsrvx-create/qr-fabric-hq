import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import MetersDisplay from '@/components/MetersDisplay';
import { getSKUByCode, getLocationById, getLocationLabel } from '@/data/mockData';
import { useWarehouseStore } from '@/hooks/useWarehouseStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

const IssuePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rollIdParam = searchParams.get('roll') || '';
  const [inputRollId, setInputRollId] = useState(rollIdParam);
  const [meters, setMeters] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [issueType, setIssueType] = useState<'meters' | 'roll'>('meters');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const warehouse = useWarehouseStore();

  const roll = warehouse.getRollById(inputRollId);
  const sku = roll ? getSKUByCode(roll.sku_code) : null;
  const location = roll ? getLocationById(roll.location_id) : null;

  const handleSubmit = () => {
    setError('');
    if (!roll) { setError('Rulonas nerastas'); return; }
    if (roll.status === 'CONSUMED') { setError('Rulonas jau sunaudotas'); return; }

    if (issueType === 'meters') {
      const qty = parseFloat(meters);
      if (isNaN(qty) || qty <= 0) { setError('Įveskite teigiamą kiekį'); return; }
      if (qty > roll.meters_remaining) {
        setError(`Nepakanka likučio: turite ${roll.meters_remaining.toFixed(2)} m, bandote ${qty.toFixed(2)} m`);
        return;
      }
      const ok = warehouse.issueMeters(roll.roll_id, qty, orderNo || undefined);
      if (!ok) { setError('Klaida nurašant'); return; }
    } else {
      const ok = warehouse.issueWholeRoll(roll.roll_id, orderNo || undefined);
      if (!ok) { setError('Klaida nurašant ruloną'); return; }
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MobileLayout title="Nurašymas" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
          <CheckCircle className="w-16 h-16 text-[hsl(var(--success))]" />
          <p className="text-xl font-bold">Sėkmingai nurašyta!</p>
          <p className="text-muted-foreground text-center">
            {issueType === 'meters' ? `${meters} m nurašyta iš ${inputRollId}` : `Visas rulonas ${inputRollId} nurašytas`}
          </p>
          <div className="flex gap-3 w-full max-w-sm">
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/roll/${inputRollId}`)}>Grįžti į ruloną</Button>
            <Button className="flex-1" onClick={() => { setSubmitted(false); setMeters(''); setOrderNo(''); setError(''); }}>Nurašyti dar</Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Nurašyti" showBack>
      <div className="px-4 py-4 space-y-4">
        {/* Type Toggle */}
        <div className="flex bg-card rounded-xl border border-border overflow-hidden">
          <button onClick={() => setIssueType('meters')} className={`flex-1 py-3 font-medium transition-colors ${issueType === 'meters' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            Metrais
          </button>
          <button onClick={() => setIssueType('roll')} className={`flex-1 py-3 font-medium transition-colors ${issueType === 'roll' ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground'}`}>
            Visas rulonas
          </button>
        </div>

        {/* Roll ID */}
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Roll ID</label>
          <Input value={inputRollId} onChange={e => setInputRollId(e.target.value)} placeholder="R-00001" className="h-12 font-mono text-lg" />
        </div>

        {/* Roll Info */}
        {roll && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{sku?.name || roll.sku_code}</p>
                <p className="text-sm text-muted-foreground">{location ? getLocationLabel(location) : '—'}</p>
              </div>
              <MetersDisplay meters={roll.meters_remaining} label="Likutis" />
            </div>
            {roll.status === 'RESERVED' && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <p className="text-xs text-primary font-medium">⚠ Rezervuotas: {roll.reserved_for_order}</p>
              </div>
            )}
          </div>
        )}

        {/* Meters input */}
        {issueType === 'meters' && (
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Kiekis (metrai)</label>
            <Input
              type="number"
              step="0.01"
              value={meters}
              onChange={e => setMeters(e.target.value)}
              placeholder="0.00"
              className="h-14 font-mono text-2xl text-center"
            />
          </div>
        )}

        {/* Order */}
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Užsakymo Nr. (neprivaloma)</label>
          <Input value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="ORD-2024-000" className="h-12 font-mono" />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          className={`w-full h-14 text-lg font-bold ${issueType === 'roll' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}`}
        >
          {issueType === 'meters' ? 'Nurašyti metrus' : 'Nurašyti visą ruloną'}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default IssuePage;
