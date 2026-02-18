import { FabricSKU, Roll, StockMovement } from '@/types/warehouse';
import { mockRolls, mockMovements, mockSKUs } from './mockData';

// Mutable in-memory store (singleton)
class WarehouseStore {
  rolls: Roll[];
  movements: StockMovement[];
  skus: FabricSKU[];
  version = 0;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.rolls = mockRolls.map(r => ({ ...r }));
    this.movements = mockMovements.map(m => ({ ...m }));
    this.skus = mockSKUs.map(s => ({ ...s }));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.version++;
    this.listeners.forEach(fn => fn());
  }

  getRollById(id: string) {
    return this.rolls.find(r => r.roll_id === id);
  }

  getRollByQR(qr: string) {
    return this.rolls.find(r => r.qr_code_value === qr);
  }

  issueMeters(rollId: string, qty: number, orderNo?: string) {
    const roll = this.getRollById(rollId);
    if (!roll || qty > roll.meters_remaining) return false;
    roll.meters_remaining = parseFloat((roll.meters_remaining - qty).toFixed(2));
    if (roll.meters_remaining === 0) roll.status = 'CONSUMED';
    this.addMovement('ISSUE_METERS', rollId, roll.sku_code, -qty, undefined, undefined, orderNo);
    this.notify();
    return true;
  }

  issueWholeRoll(rollId: string, orderNo?: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status === 'CONSUMED') return false;
    const qty = roll.meters_remaining;
    roll.meters_remaining = 0;
    roll.status = 'CONSUMED';
    this.addMovement('ISSUE_ROLL', rollId, roll.sku_code, -qty, undefined, undefined, orderNo);
    this.notify();
    return true;
  }

  moveRoll(rollId: string, newLocationId: string) {
    const roll = this.getRollById(rollId);
    if (!roll) return false;
    const fromId = roll.location_id;
    roll.location_id = newLocationId;
    this.addMovement('MOVE', rollId, roll.sku_code, 0, fromId, newLocationId);
    this.notify();
    return true;
  }

  addRoll(roll: Roll) {
    this.rolls.push(roll);
    this.addMovement('ADD_ROLL', roll.roll_id, roll.sku_code, roll.meters_initial, undefined, roll.location_id);
    this.notify();
  }

  addMeters(rollId: string, qty: number, note?: string) {
    const roll = this.getRollById(rollId);
    if (!roll || qty <= 0) return false;
    roll.meters_remaining = parseFloat((roll.meters_remaining + qty).toFixed(2));
    roll.meters_initial = parseFloat((roll.meters_initial + qty).toFixed(2));
    if (roll.status === 'CONSUMED') roll.status = 'ACTIVE';
    this.addMovement('ADD_METERS', rollId, roll.sku_code, qty, undefined, undefined, undefined, note);
    this.notify();
    return true;
  }

  reserveRoll(rollId: string, orderNo: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status !== 'ACTIVE') return false;
    roll.status = 'RESERVED';
    roll.reserved_for_order = orderNo;
    this.addMovement('RESERVE', rollId, roll.sku_code, 0, undefined, undefined, orderNo);
    this.notify();
    return true;
  }

  unreserveRoll(rollId: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status !== 'RESERVED') return false;
    roll.status = 'ACTIVE';
    roll.reserved_for_order = undefined;
    this.addMovement('UNRESERVE', rollId, roll.sku_code, 0);
    this.notify();
    return true;
  }

  // SKU methods
  getSKUs() { return this.skus; }

  getSKUByCode(code: string) { return this.skus.find(s => s.sku_code === code); }

  addSKU(sku: FabricSKU) {
    if (this.skus.find(s => s.sku_code === sku.sku_code)) return false;
    this.skus.push(sku);
    this.notify();
    return true;
  }

  updateSKU(skuCode: string, updates: Partial<FabricSKU>) {
    const sku = this.getSKUByCode(skuCode);
    if (!sku) return false;
    Object.assign(sku, updates);
    this.notify();
    return true;
  }

  deleteSKU(skuCode: string) {
    const hasRolls = this.rolls.some(r => r.sku_code === skuCode);
    if (hasRolls) return false;
    this.skus = this.skus.filter(s => s.sku_code !== skuCode);
    this.notify();
    return true;
  }

  private addMovement(
    type: StockMovement['type'], rollId: string, skuCode: string, qty: number,
    fromLocationId?: string, toLocationId?: string, orderNo?: string, note?: string
  ) {
    this.movements.push({
      id: `M${String(this.movements.length + 1).padStart(3, '0')}`,
      type, datetime: new Date().toISOString(), user_id: 'U1',
      roll_id: rollId, sku_code: skuCode, qty_meters: qty,
      from_location_id: fromLocationId, to_location_id: toLocationId,
      order_no: orderNo, note,
    });
  }
}

export const store = new WarehouseStore();
