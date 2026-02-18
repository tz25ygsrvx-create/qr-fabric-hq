import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ScanLine, Keyboard } from 'lucide-react';
import { getRollByQR, getRollById } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ScanPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');

  const handleLookup = (value: string) => {
    setError('');
    const roll = getRollByQR(value) || getRollById(value);
    if (roll) {
      navigate(`/roll/${roll.roll_id}`);
    } else {
      setError(`Rulonas "${value}" nerastas. Galite sukurti naują.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleLookup(manualInput.trim());
    }
  };

  return (
    <MobileLayout title="Scan Roll" showBack>
      <div className="flex flex-col items-center px-4 pt-8 gap-6">
        {/* Mode Toggle */}
        <div className="flex bg-card rounded-xl border border-border overflow-hidden w-full max-w-sm">
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${
              mode === 'scan' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <ScanLine className="w-5 h-5" />
            QR Scan
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-medium transition-colors ${
              mode === 'manual' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            <Keyboard className="w-5 h-5" />
            Rankiniu
          </button>
        </div>

        {mode === 'scan' ? (
          <div className="w-full max-w-sm">
            <div className="aspect-square bg-card rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4">
              <ScanLine className="w-16 h-16 text-primary animate-pulse" />
              <p className="text-muted-foreground text-center px-8">
                Nukreipkite kamerą į QR kodą ant rulono
              </p>
              <p className="text-xs text-muted-foreground">
                (Kamera bus prieinama su backend)
              </p>
            </div>

            {/* Demo buttons */}
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground text-center">Demo: pasirinkite ruloną</p>
              {['QR-R00001', 'QR-R00004', 'QR-R00006'].map(qr => (
                <Button
                  key={qr}
                  variant="outline"
                  className="w-full font-mono"
                  onClick={() => handleLookup(qr)}
                >
                  {qr}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Roll ID arba QR kodas</label>
              <Input
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                placeholder="pvz. R-00001 arba QR-R00001"
                className="text-lg h-14 font-mono"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold">
              Ieškoti
            </Button>
          </form>
        )}

        {error && (
          <div className="w-full max-w-sm bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <p className="text-destructive text-sm font-medium">{error}</p>
            <Button
              variant="outline"
              className="mt-3 w-full border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => navigate('/add-roll')}
            >
              Sukurti naują ruloną
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default ScanPage;
