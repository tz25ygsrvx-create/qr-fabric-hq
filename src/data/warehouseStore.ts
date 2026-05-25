import { FabricSKU, Roll, StockMovement } from '@/types/warehouse';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_CATEGORIES = ['Dieniniai', 'Naktiniai', 'Blackout', 'Tinkleliai', 'Romanetės', 'Kita'];

export interface QuoteItem {
  id: string;
  quote_id: string;
  quote_number: string;
  fabric_name: string;
  width_m: number;
  height_m: number;
  pleating_factor: number;
  qty: number;
  notes?: string;
}

class WarehouseStore {
  rolls: Roll[] = [];
  movements: StockMovement[] = [];
  skus: FabricSKU[] = [];
  categories: string[] = [...DEFAULT_CATEGORIES];
  version = 0;
  loaded = false;
  loading = false;
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    if (!this.loaded && !this.loading) this.loadAll();
    return () => { this.listeners.delete(listener); };
  }

  private notify() {
    this.version++;
    this.listeners.forEach(fn => fn());
  }

  async loadAll() {
    if (this.loading) return;
    this.loading = true;
    try {
      const [skusRes, rollsRes, movsRes] = await Promise.all([
        supabase.from('fabric_skus').select('*').order('sku_code'),
        supabase.from('fabric_rolls').select('*').order('roll_id'),
        supabase.from('fabric_movements').select('*').order('datetime', { ascending: false }).limit(500),
      ]);
      if (skusRes.data) {
        this.skus = skusRes.data.map((s: any) => ({
          sku_code: s.sku_code, name: s.name, category: s.category,
          width_cm: s.width_cm ? Number(s.width_cm) : undefined,
          color: s.color || undefined, collection: s.collection || undefined,
          notes: s.notes || undefined,
        }));
        const extraCats = Array.from(new Set(this.skus.map(s => s.category).filter(c => !this.categories.includes(c))));
        this.categories = [...this.categories, ...extraCats];
      }
      if (rollsRes.data) {
        this.rolls = rollsRes.data.map((r: any) => ({
          roll_id: r.roll_id, sku_code: r.sku_code, qr_code_value: r.qr_code_value,
          meters_initial: Number(r.meters_initial), meters_remaining: Number(r.meters_remaining),
          location_id: r.location_id, status: r.status,
          reserved_for_order: r.reserved_for_order || undefined,
          received_date: r.received_date || undefined,
          supplier: r.supplier || undefined, doc_no: r.doc_no || undefined,
        }));
      }
      if (movsRes.data) {
        this.movements = movsRes.data.map((m: any) => ({
          id: m.id, type: m.type, datetime: m.datetime, user_id: m.user_id,
          roll_id: m.roll_id, sku_code: m.sku_code, qty_meters: Number(m.qty_meters),
          from_location_id: m.from_location_id || undefined,
          to_location_id: m.to_location_id || undefined,
          order_no: m.order_no || undefined, note: m.note || undefined,
        }));
      }
      this.loaded = true;
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  getRollById(id: string) { return this.rolls.find(r => r.roll_id === id); }
  getRollByQR(qr: string) { return this.rolls.find(r => r.qr_code_value === qr); }
  getSKUs() { return this.skus; }
  getSKUByCode(code: string) { return this.skus.find(s => s.sku_code === code); }
  getCategories() { return this.categories; }

  private async persistRoll(rollId: string, updates: Partial<Roll>) {
    const payload: any = { ...updates };
    await supabase.from('fabric_rolls').update(payload).eq('roll_id', rollId);
  }

  private async persistMovement(type: StockMovement['type'], rollId: string, skuCode: string, qty: number,
    fromLocationId?: string, toLocationId?: string, orderNo?: string, note?: string, source = 'warehouse') {
    const { data } = await supabase.from('fabric_movements').insert({
      type, roll_id: rollId, sku_code: skuCode, qty_meters: qty,
      from_location_id: fromLocationId, to_location_id: toLocationId,
      order_no: orderNo, note, source,
    }).select().single();
    if (data) {
      this.movements.unshift({
        id: data.id, type: data.type as any, datetime: data.datetime, user_id: data.user_id,
        roll_id: data.roll_id, sku_code: data.sku_code, qty_meters: Number(data.qty_meters),
        from_location_id: data.from_location_id || undefined,
        to_location_id: data.to_location_id || undefined,
        order_no: data.order_no || undefined, note: data.note || undefined,
      });
    }
  }

  issueMeters(rollId: string, qty: number, orderNo?: string, source = 'warehouse') {
    const roll = this.getRollById(rollId);
    if (!roll || qty > roll.meters_remaining) return false;
    roll.meters_remaining = parseFloat((roll.meters_remaining - qty).toFixed(2));
    const newStatus = roll.meters_remaining === 0 ? 'CONSUMED' : roll.status;
    roll.status = newStatus;
    this.persistRoll(rollId, { meters_remaining: roll.meters_remaining, status: newStatus });
    this.persistMovement('ISSUE_METERS', rollId, roll.sku_code, -qty, undefined, undefined, orderNo, undefined, source);
    this.notify();
    return true;
  }

  issueWholeRoll(rollId: string, orderNo?: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status === 'CONSUMED') return false;
    const qty = roll.meters_remaining;
    roll.meters_remaining = 0;
    roll.status = 'CONSUMED';
    this.persistRoll(rollId, { meters_remaining: 0, status: 'CONSUMED' });
    this.persistMovement('ISSUE_ROLL', rollId, roll.sku_code, -qty, undefined, undefined, orderNo);
    this.notify();
    return true;
  }

  moveRoll(rollId: string, newLocationId: string) {
    const roll = this.getRollById(rollId);
    if (!roll) return false;
    const fromId = roll.location_id;
    roll.location_id = newLocationId;
    this.persistRoll(rollId, { location_id: newLocationId });
    this.persistMovement('MOVE', rollId, roll.sku_code, 0, fromId, newLocationId);
    this.notify();
    return true;
  }

  async addRoll(roll: Roll) {
    this.rolls.push(roll);
    this.notify();
    await supabase.from('fabric_rolls').insert({
      roll_id: roll.roll_id, sku_code: roll.sku_code, qr_code_value: roll.qr_code_value,
      meters_initial: roll.meters_initial, meters_remaining: roll.meters_remaining,
      location_id: roll.location_id, status: roll.status,
      received_date: roll.received_date, supplier: roll.supplier,
    });
    this.persistMovement('ADD_ROLL', roll.roll_id, roll.sku_code, roll.meters_initial, undefined, roll.location_id);
  }

  addMeters(rollId: string, qty: number, note?: string) {
    const roll = this.getRollById(rollId);
    if (!roll || qty <= 0) return false;
    roll.meters_remaining = parseFloat((roll.meters_remaining + qty).toFixed(2));
    roll.meters_initial = parseFloat((roll.meters_initial + qty).toFixed(2));
    if (roll.status === 'CONSUMED') roll.status = 'ACTIVE';
    this.persistRoll(rollId, { meters_remaining: roll.meters_remaining, meters_initial: roll.meters_initial, status: roll.status });
    this.persistMovement('ADD_METERS', rollId, roll.sku_code, qty, undefined, undefined, undefined, note);
    this.notify();
    return true;
  }

  reserveRoll(rollId: string, orderNo: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status !== 'ACTIVE') return false;
    roll.status = 'RESERVED';
    roll.reserved_for_order = orderNo;
    this.persistRoll(rollId, { status: 'RESERVED', reserved_for_order: orderNo });
    this.persistMovement('RESERVE', rollId, roll.sku_code, 0, undefined, undefined, orderNo);
    this.notify();
    return true;
  }

  unreserveRoll(rollId: string) {
    const roll = this.getRollById(rollId);
    if (!roll || roll.status !== 'RESERVED') return false;
    roll.status = 'ACTIVE';
    roll.reserved_for_order = undefined;
    this.persistRoll(rollId, { status: 'ACTIVE', reserved_for_order: null as any });
    this.persistMovement('UNRESERVE', rollId, roll.sku_code, 0);
    this.notify();
    return true;
  }

  async addSKU(sku: FabricSKU) {
    if (this.skus.find(s => s.sku_code === sku.sku_code)) return false;
    this.skus.push(sku);
    this.notify();
    await supabase.from('fabric_skus').insert({
      sku_code: sku.sku_code, name: sku.name, category: sku.category,
      width_cm: sku.width_cm, color: sku.color, collection: sku.collection, notes: sku.notes,
    });
    return true;
  }

  async updateSKU(skuCode: string, updates: Partial<FabricSKU>) {
    const sku = this.getSKUByCode(skuCode);
    if (!sku) return false;
    Object.assign(sku, updates);
    this.notify();
    await supabase.from('fabric_skus').update(updates).eq('sku_code', skuCode);
    return true;
  }

  async deleteSKU(skuCode: string) {
    const hasRolls = this.rolls.some(r => r.sku_code === skuCode);
    if (hasRolls) return false;
    this.skus = this.skus.filter(s => s.sku_code !== skuCode);
    this.notify();
    await supabase.from('fabric_skus').delete().eq('sku_code', skuCode);
    return true;
  }

  addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed || this.categories.includes(trimmed)) return false;
    this.categories.push(trimmed);
    this.notify();
    return true;
  }

  renameCategory(oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed || this.categories.includes(trimmed)) return false;
    const idx = this.categories.indexOf(oldName);
    if (idx === -1) return false;
    this.categories[idx] = trimmed;
    this.skus.filter(s => s.category === oldName).forEach(s => { s.category = trimmed; });
    this.notify();
    supabase.from('fabric_skus').update({ category: trimmed }).eq('category', oldName);
    return true;
  }

  deleteCategory(name: string) {
    const hasSkus = this.skus.some(s => s.category === name);
    if (hasSkus) return false;
    this.categories = this.categories.filter(c => c !== name);
    this.notify();
    return true;
  }

  // Quotes
  async fetchQuoteItems(quoteNumber: string): Promise<QuoteItem[]> {
    const { data } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_number', quoteNumber);
    if (!data) return [];
    return data.map((q: any) => ({
      id: q.id, quote_id: q.quote_id, quote_number: q.quote_number,
      fabric_name: q.fabric_name,
      width_m: Number(q.width_m), height_m: Number(q.height_m),
      pleating_factor: Number(q.pleating_factor), qty: q.qty,
      notes: q.notes || undefined,
    }));
  }
}

export const store = new WarehouseStore();
