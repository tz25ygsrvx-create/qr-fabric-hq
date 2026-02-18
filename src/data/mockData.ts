import { FabricSKU, Roll, Location, StockMovement, User } from '@/types/warehouse';

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

export const mockSKUs: FabricSKU[] = [
  { sku_code: 'DN-001', name: 'Linas Natūralus', category: 'Dieniniai', width_cm: 300, color: 'Smėlio', collection: '2024 Pavasaris' },
  { sku_code: 'DN-002', name: 'Batistas Baltas', category: 'Dieniniai', width_cm: 280, color: 'Balta' },
  { sku_code: 'NK-001', name: 'Aksomas Tamsus', category: 'Naktiniai', width_cm: 280, color: 'Tamsiai pilka', collection: '2024 Ruduo' },
  { sku_code: 'NK-002', name: 'Satinas Sidabrinis', category: 'Naktiniai', width_cm: 300, color: 'Sidabrinė' },
  { sku_code: 'BO-001', name: 'Blackout Premium', category: 'Blackout', width_cm: 280, color: 'Juoda' },
  { sku_code: 'BO-002', name: 'Blackout Kreminė', category: 'Blackout', width_cm: 300, color: 'Kreminė' },
  { sku_code: 'TK-001', name: 'Tinklelis Klasikinis', category: 'Tinkleliai', width_cm: 300, color: 'Balta' },
  { sku_code: 'RM-001', name: 'Romanetė Gėlės', category: 'Romanetės', width_cm: 140, color: 'Įvairi' },
];

export const mockRolls: Roll[] = [
  { roll_id: 'R-00001', sku_code: 'DN-001', qr_code_value: 'QR-R00001', meters_initial: 50.00, meters_remaining: 32.50, location_id: 'L001', status: 'ACTIVE', received_date: '2024-12-01', supplier: 'Audiniai UAB' },
  { roll_id: 'R-00002', sku_code: 'DN-001', qr_code_value: 'QR-R00002', meters_initial: 50.00, meters_remaining: 50.00, location_id: 'L001', status: 'ACTIVE', received_date: '2024-12-15', supplier: 'Audiniai UAB' },
  { roll_id: 'R-00003', sku_code: 'DN-002', qr_code_value: 'QR-R00003', meters_initial: 30.00, meters_remaining: 12.80, location_id: 'L002', status: 'ACTIVE' },
  { roll_id: 'R-00004', sku_code: 'NK-001', qr_code_value: 'QR-R00004', meters_initial: 40.00, meters_remaining: 40.00, location_id: 'L004', status: 'RESERVED', reserved_for_order: 'ORD-2024-155', received_date: '2025-01-10', supplier: 'Tekstilė LT' },
  { roll_id: 'R-00005', sku_code: 'NK-002', qr_code_value: 'QR-R00005', meters_initial: 25.00, meters_remaining: 0.00, location_id: 'L005', status: 'CONSUMED' },
  { roll_id: 'R-00006', sku_code: 'BO-001', qr_code_value: 'QR-R00006', meters_initial: 50.00, meters_remaining: 45.30, location_id: 'L007', status: 'ACTIVE', supplier: 'Blackout EU' },
  { roll_id: 'R-00007', sku_code: 'BO-002', qr_code_value: 'QR-R00007', meters_initial: 30.00, meters_remaining: 8.00, location_id: 'L008', status: 'ACTIVE' },
  { roll_id: 'R-00008', sku_code: 'TK-001', qr_code_value: 'QR-R00008', meters_initial: 100.00, meters_remaining: 67.20, location_id: 'L003', status: 'ACTIVE', received_date: '2025-01-20' },
];

export const mockMovements: StockMovement[] = [
  { id: 'M001', type: 'ADD_ROLL', datetime: '2024-12-01T09:00:00', user_id: 'U1', roll_id: 'R-00001', sku_code: 'DN-001', qty_meters: 50.00, to_location_id: 'L001', note: 'Naujas pristatymas' },
  { id: 'M002', type: 'ISSUE_METERS', datetime: '2024-12-10T14:30:00', user_id: 'U1', roll_id: 'R-00001', sku_code: 'DN-001', qty_meters: -12.50, order_no: 'ORD-2024-140' },
  { id: 'M003', type: 'ISSUE_METERS', datetime: '2024-12-20T11:00:00', user_id: 'U2', roll_id: 'R-00001', sku_code: 'DN-001', qty_meters: -5.00, order_no: 'ORD-2024-148' },
  { id: 'M004', type: 'RESERVE', datetime: '2025-01-10T08:00:00', user_id: 'U1', roll_id: 'R-00004', sku_code: 'NK-001', qty_meters: 0, order_no: 'ORD-2024-155', note: 'Klientas A' },
  { id: 'M005', type: 'ISSUE_ROLL', datetime: '2025-01-15T16:00:00', user_id: 'U2', roll_id: 'R-00005', sku_code: 'NK-002', qty_meters: -25.00, order_no: 'ORD-2024-160' },
  { id: 'M006', type: 'ADD_ROLL', datetime: '2025-01-20T10:00:00', user_id: 'U1', roll_id: 'R-00008', sku_code: 'TK-001', qty_meters: 100.00, to_location_id: 'L003' },
];

export const mockUsers: User[] = [
  { id: 'U1', name: 'Jonas K.', role: 'Admin' },
  { id: 'U2', name: 'Petras V.', role: 'Sandėlininkas' },
  { id: 'U3', name: 'Ona M.', role: 'Peržiūra' },
];

export const getLocationLabel = (loc: Location) => `${loc.rack}-${loc.section}-${loc.shelf}`;

export const getLocationById = (id: string) => mockLocations.find(l => l.id === id);

export const getSKUByCode = (code: string) => mockSKUs.find(s => s.sku_code === code);

export const getRollById = (id: string) => mockRolls.find(r => r.roll_id === id);

export const getRollByQR = (qr: string) => mockRolls.find(r => r.qr_code_value === qr);
