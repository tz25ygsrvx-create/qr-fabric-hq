export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      fabric_movements: {
        Row: {
          datetime: string | null
          from_location_id: string | null
          id: string
          note: string | null
          order_no: string | null
          qty_meters: number
          roll_id: string
          sku_code: string
          source: string | null
          to_location_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          datetime?: string | null
          from_location_id?: string | null
          id?: string
          note?: string | null
          order_no?: string | null
          qty_meters: number
          roll_id: string
          sku_code: string
          source?: string | null
          to_location_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          datetime?: string | null
          from_location_id?: string | null
          id?: string
          note?: string | null
          order_no?: string | null
          qty_meters?: number
          roll_id?: string
          sku_code?: string
          source?: string | null
          to_location_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fabric_rolls: {
        Row: {
          created_at: string | null
          doc_no: string | null
          id: string
          location_id: string
          meters_initial: number
          meters_remaining: number
          qr_code_value: string
          received_date: string | null
          reserved_for_order: string | null
          roll_id: string
          sku_code: string | null
          status: string | null
          supplier: string | null
        }
        Insert: {
          created_at?: string | null
          doc_no?: string | null
          id?: string
          location_id: string
          meters_initial: number
          meters_remaining: number
          qr_code_value: string
          received_date?: string | null
          reserved_for_order?: string | null
          roll_id: string
          sku_code?: string | null
          status?: string | null
          supplier?: string | null
        }
        Update: {
          created_at?: string | null
          doc_no?: string | null
          id?: string
          location_id?: string
          meters_initial?: number
          meters_remaining?: number
          qr_code_value?: string
          received_date?: string | null
          reserved_for_order?: string | null
          roll_id?: string
          sku_code?: string | null
          status?: string | null
          supplier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fabric_rolls_sku_code_fkey"
            columns: ["sku_code"]
            isOneToOne: false
            referencedRelation: "fabric_skus"
            referencedColumns: ["sku_code"]
          },
        ]
      }
      fabric_skus: {
        Row: {
          category: string
          collection: string | null
          color: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          sku_code: string
          type: string
          width_cm: number | null
        }
        Insert: {
          category: string
          collection?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          sku_code: string
          type?: string
          width_cm?: number | null
        }
        Update: {
          category?: string
          collection?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          sku_code?: string
          type?: string
          width_cm?: number | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string | null
          fabric_name: string
          height_m: number
          id: string
          notes: string | null
          pleating_factor: number
          qty: number
          quote_id: string | null
          quote_number: string
          width_m: number
        }
        Insert: {
          created_at?: string | null
          fabric_name: string
          height_m?: number
          id?: string
          notes?: string | null
          pleating_factor?: number
          qty?: number
          quote_id?: string | null
          quote_number: string
          width_m?: number
        }
        Update: {
          created_at?: string | null
          fabric_name?: string
          height_m?: number
          id?: string
          notes?: string | null
          pleating_factor?: number
          qty?: number
          quote_id?: string | null
          quote_number?: string
          width_m?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_name: string | null
          created_at: string | null
          id: string
          notes: string | null
          quote_date: string | null
          quote_number: string
          status: string | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quote_date?: string | null
          quote_number: string
          status?: string | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          quote_date?: string | null
          quote_number?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
