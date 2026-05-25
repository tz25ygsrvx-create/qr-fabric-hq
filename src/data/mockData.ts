import { Location, User } from '@/types/warehouse';

export const mockLocations: Location[] = [
  { id: 'L001', rack: 'A', section: '1', shelf: '1', notes: 'Dieniniai audiniai' },
  { id: 'L002', rack: 'A', section: '1', shelf: '2' },
  { id: 'L003', rack: 'A', section: '2', shelf: '1' },
  { id: 'L004', rack: 'B', section: '1', shelf: '1', notes: 'Naktiniai audiniai' },
  { id: 'L005', rack: 'B', section: '1', shelf: '2' },
  { id: 'L006', rack: 'B', section: '2', shelf: '1' },
  { id: 'L007', rack: 'C', section: '1', shelf: '1', notes: 'Blackout' },
  { id: 'L008', rack: 'C', section: '1', shelf: '2' },
];

export const mockUsers: User[] = [
  { id: 'U1', name: 'Jonas K.', role: 'Admin' },
  { id: 'U2', name: 'Petras V.', role: 'Sandėlininkas' },
  { id: 'U3', name: 'Ona M.', role: 'Peržiūra' },
];

export const getLocationLabel = (loc: Location) => `${loc.rack}-${loc.section}-${loc.shelf}`;
export const getLocationById = (id: string) => mockLocations.find(l => l.id === id);

// Backwards-compat shims — components should import from warehouseStore instead
import { store } from './warehouseStore';
export const mockSKUs = store.skus;
export const mockRolls = store.rolls;
export const mockMovements = store.movements;
export const getSKUByCode = (code: string) => store.getSKUByCode(code);
export const getRollById = (id: string) => store.getRollById(id);
export const getRollByQR = (qr: string) => store.getRollByQR(qr);
