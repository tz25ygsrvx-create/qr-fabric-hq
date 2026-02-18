export type FabricCategory = 'Dieniniai' | 'Naktiniai' | 'Blackout' | 'Tinkleliai' | 'Romanetės' | 'Kita';
export type RollStatus = 'ACTIVE' | 'RESERVED' | 'CONSUMED';
export type MovementType = 'ADD_ROLL' | 'ADD_METERS' | 'ISSUE_METERS' | 'ISSUE_ROLL' | 'MOVE' | 'ADJUST' | 'RETURN' | 'RESERVE' | 'UNRESERVE';
export type UserRole = 'Admin' | 'Sandėlininkas' | 'Peržiūra';

export interface FabricSKU {
  sku_code: string;
  name: string;
  category: FabricCategory;
  width_cm?: number;
  height_cm?: number;
  color?: string;
  collection?: string;
  notes?: string;
  photos?: string[];
}

export interface Location {
  id: string;
  rack: string;
  section: string;
  shelf: string;
  notes?: string;
}

export interface Roll {
  roll_id: string;
  sku_code: string;
  qr_code_value: string;
  meters_initial: number;
  meters_remaining: number;
  location_id: string;
  status: RollStatus;
  reserved_for_order?: string;
  received_date?: string;
  supplier?: string;
  doc_no?: string;
  photos?: string[];
}

export interface StockMovement {
  id: string;
  type: MovementType;
  datetime: string;
  user_id: string;
  roll_id: string;
  sku_code: string;
  qty_meters: number;
  from_location_id?: string;
  to_location_id?: string;
  order_no?: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
