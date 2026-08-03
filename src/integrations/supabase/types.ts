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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          consent: boolean
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          language: string
          message: string | null
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          service_id: string | null
          service_label: string | null
          source: string
          staff_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          language?: string
          message?: string | null
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_id?: string | null
          service_label?: string | null
          source?: string
          staff_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          language?: string
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          service_id?: string | null
          service_label?: string | null
          source?: string
          staff_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff_members"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_leads: {
        Row: {
          converted_booking_id: string | null
          created_at: string
          id: string
          is_processed: boolean
          language: string
          message: string | null
          name: string | null
          phone: string | null
          preferred_date: string | null
          preferred_service: string | null
          preferred_time: string | null
          transcript: Json
          updated_at: string
        }
        Insert: {
          converted_booking_id?: string | null
          created_at?: string
          id?: string
          is_processed?: boolean
          language?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_service?: string | null
          preferred_time?: string | null
          transcript?: Json
          updated_at?: string
        }
        Update: {
          converted_booking_id?: string | null
          created_at?: string
          id?: string
          is_processed?: boolean
          language?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_service?: string | null
          preferred_time?: string | null
          transcript?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_leads_converted_booking_id_fkey"
            columns: ["converted_booking_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          caption: Json
          category_id: string | null
          created_at: string
          id: string
          is_visible: boolean
          media_type: string
          media_url: string
          sort_order: number
        }
        Insert: {
          caption?: Json
          category_id?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          media_type?: string
          media_url: string
          sort_order?: number
        }
        Update: {
          caption?: Json
          category_id?: string | null
          created_at?: string
          id?: string
          is_visible?: boolean
          media_type?: string
          media_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt: Json
          bucket: string
          created_at: string
          created_by: string | null
          file_name: string | null
          id: string
          media_type: string
          path: string
          public_url: string
          size_bytes: number | null
        }
        Insert: {
          alt?: Json
          bucket: string
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          id?: string
          media_type?: string
          path: string
          public_url: string
          size_bytes?: number | null
        }
        Update: {
          alt?: Json
          bucket?: string
          created_at?: string
          created_by?: string | null
          file_name?: string | null
          id?: string
          media_type?: string
          path?: string
          public_url?: string
          size_bytes?: number | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          href: string
          id: string
          is_visible: boolean
          label: Json
          location: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: Json
          location?: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          is_visible?: boolean
          label?: Json
          location?: string
          sort_order?: number
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: Json
          id: string
          image_url: string | null
          is_active: boolean
          name: Json
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: Json
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: Json
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string
          currency: string
          description: Json
          duration_min: number | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: Json
          price_from: number | null
          sort_order: number
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: Json
          duration_min?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: Json
          price_from?: number | null
          sort_order?: number
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          currency?: string
          description?: Json
          duration_min?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: Json
          price_from?: number | null
          sort_order?: number
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      showcase_items: {
        Row: {
          caption: Json
          created_at: string
          id: string
          is_visible: boolean
          poster_url: string | null
          sort_order: number
          title: Json
          video_url: string | null
        }
        Insert: {
          caption?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          poster_url?: string | null
          sort_order?: number
          title?: Json
          video_url?: string | null
        }
        Update: {
          caption?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          poster_url?: string | null
          sort_order?: number
          title?: Json
          video_url?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          admin_label: string
          content: Json
          id: string
          is_visible: boolean
          section_id: string
          sort_order: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          admin_label?: string
          content?: Json
          id?: string
          is_visible?: boolean
          section_id: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          admin_label?: string
          content?: Json
          id?: string
          is_visible?: boolean
          section_id?: string
          sort_order?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      staff_members: {
        Row: {
          bio: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          photo_url: string | null
          role_label: Json
          sort_order: number
        }
        Insert: {
          bio?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          photo_url?: string | null
          role_label?: Json
          sort_order?: number
        }
        Update: {
          bio?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          photo_url?: string | null
          role_label?: Json
          sort_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          avatar_url: string | null
          created_at: string
          id: string
          is_pinned: boolean
          is_visible: boolean
          rating: number
          service_type: Json
          sort_order: number
          text: Json
        }
        Insert: {
          author: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_visible?: boolean
          rating?: number
          service_type?: Json
          sort_order?: number
          text?: Json
        }
        Update: {
          author?: string
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_pinned?: boolean
          is_visible?: boolean
          rating?: number
          service_type?: Json
          sort_order?: number
          text?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff_member: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "staff"
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
    Enums: {
      app_role: ["admin", "manager", "staff"],
    },
  },
} as const
