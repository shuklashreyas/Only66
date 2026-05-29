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
      challenges: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["challenge_kind"]
          motivation: string | null
          name: string
          reminder_time: string
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"]
          tone: Database["public"]["Enums"]["challenge_tone"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["challenge_kind"]
          motivation?: string | null
          name: string
          reminder_time?: string
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"]
          tone?: Database["public"]["Enums"]["challenge_tone"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["challenge_kind"]
          motivation?: string | null
          name?: string
          reminder_time?: string
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          tone?: Database["public"]["Enums"]["challenge_tone"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          almost_folded: boolean
          challenge_id: string
          completed: boolean
          created_at: string
          date: string
          day_number: number
          difficulty: number | null
          id: string
          notes: string | null
          trigger: string | null
          user_id: string
        }
        Insert: {
          almost_folded?: boolean
          challenge_id: string
          completed?: boolean
          created_at?: string
          date: string
          day_number: number
          difficulty?: number | null
          id?: string
          notes?: string | null
          trigger?: string | null
          user_id: string
        }
        Update: {
          almost_folded?: boolean
          challenge_id?: string
          completed?: boolean
          created_at?: string
          date?: string
          day_number?: number
          difficulty?: number | null
          id?: string
          notes?: string | null
          trigger?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      panic_events: {
        Row: {
          challenge_id: string
          id: string
          occurred_at: string
          resolved: boolean
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          occurred_at?: string
          resolved?: boolean
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          occurred_at?: string
          resolved?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "panic_events_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          kind: string
          local_challenge_id: string
          local_user_id: string
          message: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          kind: string
          local_challenge_id: string
          local_user_id: string
          message?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          kind?: string
          local_challenge_id?: string
          local_user_id?: string
          message?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_local_challenge_id_fkey"
            columns: ["local_challenge_id"]
            isOneToOne: false
            referencedRelation: "reminder_challenges"
            referencedColumns: ["local_challenge_id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          active: boolean
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_error: string | null
          local_user_id: string
          p256dh: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_error?: string | null
          local_user_id: string
          p256dh: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_error?: string | null
          local_user_id?: string
          p256dh?: string
          updated_at?: string
        }
        Relationships: []
      }
      reminder_challenges: {
        Row: {
          challenge_name: string
          created_at: string
          display_name: string | null
          last_notification_sent_on: string | null
          local_challenge_id: string
          local_user_id: string
          notification_enabled: boolean
          reminder_time: string
          start_date: string
          status: Database["public"]["Enums"]["challenge_status"]
          timezone: string
          tone: Database["public"]["Enums"]["challenge_tone"]
          updated_at: string
        }
        Insert: {
          challenge_name: string
          created_at?: string
          display_name?: string | null
          last_notification_sent_on?: string | null
          local_challenge_id: string
          local_user_id: string
          notification_enabled?: boolean
          reminder_time: string
          start_date: string
          status?: Database["public"]["Enums"]["challenge_status"]
          timezone: string
          tone: Database["public"]["Enums"]["challenge_tone"]
          updated_at?: string
        }
        Update: {
          challenge_name?: string
          created_at?: string
          display_name?: string | null
          last_notification_sent_on?: string | null
          local_challenge_id?: string
          local_user_id?: string
          notification_enabled?: boolean
          reminder_time?: string
          start_date?: string
          status?: Database["public"]["Enums"]["challenge_status"]
          timezone?: string
          tone?: Database["public"]["Enums"]["challenge_tone"]
          updated_at?: string
        }
        Relationships: []
      }
      reminder_check_ins: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          day_number: number
          local_challenge_id: string
          local_user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          day_number: number
          local_challenge_id: string
          local_user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          day_number?: number
          local_challenge_id?: string
          local_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_check_ins_local_challenge_id_fkey"
            columns: ["local_challenge_id"]
            isOneToOne: false
            referencedRelation: "reminder_challenges"
            referencedColumns: ["local_challenge_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      challenge_kind: "build" | "quit"
      challenge_status: "active" | "completed" | "abandoned"
      challenge_tone: "chill" | "strict" | "brutal" | "funny"
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
      challenge_kind: ["build", "quit"],
      challenge_status: ["active", "completed", "abandoned"],
      challenge_tone: ["chill", "strict", "brutal", "funny"],
    },
  },
} as const
