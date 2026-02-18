import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { getRollById, getSKUByCode, getLocationById, getLocationLabel, mockLocations } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowRight } from 'lucide-react';

const MovePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [inputRollId, setInputRollId] = useState(searchParams.get('roll') || '');
  const [newLocationId, setNewLocationId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const roll = getRollById(inputRollId);
  const sku = roll ? getSKUByCode(roll.sku_code) : null;
  const currentLoc = roll ? getLocationById(roll.location_id) : null;
  const newLoc = getLocationById(newLocationId);

  if (submitted) {
    return (
      <MobileLayout title="Perkėlimas" showBack>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
          <CheckCircle className="w-16 h-16 text-[hsl(var(--success))]" />
          <p className="text-xl font-bold">Perkelta!</p>
          <div className="flex items-center gap-2 text-muted-foreground font-mono">
            <span>{currentLoc ? getLocationLabel(currentLoc) : '—'}</span>
            <ArrowRight className="w-4 h-4" />
            <span>{newLoc ? getLocationLabel(newLoc) : '—'}</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>Pradžia</Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Perkelti ruloną" showBack>
      <div className="px-4 py-4 space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Roll ID</label>
          <Input value={inputRollId} onChange={e => setInputRollId(e.target.value)} placeholder="R-00001" className="h-12 font-mono text-lg" />
        </div>

        {roll && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="font-bold">{sku?.name || roll.sku_code}</p>
            <p className="text-sm text-muted-foreground">
              Dabartinė lokacija: <span className="font-mono font-bold text-foreground">{currentLoc ? getLocationLabel(currentLoc) : '—'}</span>
            </p>
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Nauja lokacija</label>
          <select
            value={newLocationId}
            onChange={e => setNewLocationId(e.target.value)}
            className="w-full h-12 rounded-lg border border-input bg-card px-3 text-sm"
          >
            <option value="">Pasirinkite...</option>
            {mockLocations.filter(l => l.id !== roll?.location_id).map(loc => (
              <option key={loc.id} value={loc.id}>{getLocationLabel(loc)}{loc.notes ? ` (${loc.notes})` : ''}</option>
            ))}
          </select>
        </div>

        <Button onClick={() => setSubmitted(true)} disabled={!roll || !newLocationId} className="w-full h-14 text-lg font-bold">
          Perkelti
        </Button>
      </div>
    </MobileLayout>
  );
};

export default MovePage;
