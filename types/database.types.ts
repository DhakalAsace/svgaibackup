export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: string | null
          subscription_status: string | null
          lifetime_credits_granted: number
          lifetime_credits_used: number
          monthly_credits: number
          monthly_credits_used: number
          credits_reset_at: string
          subscription_interval: string
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string | null
          subscription_status?: string | null
          lifetime_credits_granted?: number
          lifetime_credits_used?: number
          monthly_credits?: number
          monthly_credits_used?: number
          credits_reset_at?: string
          subscription_interval?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string | null
          subscription_status?: string | null
          lifetime_credits_granted?: number
          lifetime_credits_used?: number
          monthly_credits?: number
          monthly_credits_used?: number
          credits_reset_at?: string
          subscription_interval?: string
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      svg_designs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          prompt: string | null
          svg_content: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          prompt?: string | null
          svg_content: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          prompt?: string | null
          svg_content?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          event_type: string
          payload: Json
          status: string
          error_message: string | null
          processing_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          payload: Json
          status?: string
          error_message?: string | null
          processing_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          payload?: Json
          status?: string
          error_message?: string | null
          processing_time?: number | null
          created_at?: string
        }
        Relationships: []
      }
      payment_audit_log: {
        Row: {
          id: string
          event_type: string
          user_id: string | null
          stripe_event_id: string | null
          amount: number | null
          currency: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          user_id?: string | null
          stripe_event_id?: string | null
          amount?: number | null
          currency?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          user_id?: string | null
          stripe_event_id?: string | null
          amount?: number | null
          currency?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      monitoring_metrics: {
        Row: {
          id: string
          tool: string
          metric: string
          value: number
          session_id: string | null
          user_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          tool: string
          metric: string
          value: number
          session_id?: string | null
          user_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tool?: string
          metric?: string
          value?: number
          session_id?: string | null
          user_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      funnel_conversions: {
        Row: {
          id: string
          session_id: string
          user_id: string | null
          from_tool: string | null
          to_feature: string
          journey_steps: string[]
          journey_duration: number
          device: string | null
          browser: string | null
          referrer: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id?: string | null
          from_tool?: string | null
          to_feature: string
          journey_steps: string[]
          journey_duration: number
          device?: string | null
          browser?: string | null
          referrer?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string | null
          from_tool?: string | null
          to_feature?: string
          journey_steps?: string[]
          journey_duration?: number
          device?: string | null
          browser?: string | null
          referrer?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      monitoring_alerts: {
        Row: {
          id: string
          tool: string
          metric: string
          severity: string
          message: string
          context: Json
          created_at: string
        }
        Insert: {
          id?: string
          tool: string
          metric: string
          severity: string
          message: string
          context?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tool?: string
          metric?: string
          severity?: string
          message?: string
          context?: Json
          created_at?: string
        }
        Relationships: []
      }
      web_vitals_logs: {
        Row: {
          id: string
          url: string
          user_agent: string | null
          metrics: Json
          evaluation: Json
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          user_agent?: string | null
          metrics: Json
          evaluation: Json
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          user_agent?: string | null
          metrics?: Json
          evaluation?: Json
          timestamp?: string
          created_at?: string
        }
        Relationships: []
      }
      performance_alerts: {
        Row: {
          id: string
          url: string
          issues: Json
          severity: string
          resolved: boolean
          resolved_at: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          issues: Json
          severity: string
          resolved?: boolean
          resolved_at?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          issues?: Json
          severity?: string
          resolved?: boolean
          resolved_at?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: []
      }
      error_groups: {
        Row: {
          id: string
          fingerprint: string
          service: string
          level: string
          message: string
          count: number
          status: string
          first_seen: string
          last_seen: string
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          fingerprint: string
          service: string
          level: string
          message: string
          count?: number
          status?: string
          first_seen?: string
          last_seen?: string
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          fingerprint?: string
          service?: string
          level?: string
          message?: string
          count?: number
          status?: string
          first_seen?: string
          last_seen?: string
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      error_events: {
        Row: {
          id: string
          fingerprint: string
          service: string
          level: string
          message: string
          stack: string | null
          context: Json | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          fingerprint: string
          service: string
          level: string
          message: string
          stack?: string | null
          context?: Json | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          fingerprint?: string
          service?: string
          level?: string
          message?: string
          stack?: string | null
          context?: Json | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      synthetic_checks: {
        Row: {
          id: string
          name: string
          path: string
          status: string
          response_time: number | null
          status_code: number | null
          error: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          path: string
          status: string
          response_time?: number | null
          status_code?: number | null
          error?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          path?: string
          status?: string
          response_time?: number | null
          status_code?: number | null
          error?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      uptime_metrics: {
        Row: {
          id: string
          service: string
          check_time: string
          is_up: boolean
          response_time: number | null
          status_code: number | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service: string
          check_time?: string
          is_up: boolean
          response_time?: number | null
          status_code?: number | null
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          service?: string
          check_time?: string
          is_up?: boolean
          response_time?: number | null
          status_code?: number | null
          error?: string | null
          created_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          user_id: string | null
          session_id: string | null
          properties: Json
          processed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          user_id?: string | null
          session_id?: string | null
          properties?: Json
          processed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_name?: string
          user_id?: string | null
          session_id?: string | null
          properties?: Json
          processed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      conversion_metrics: {
        Row: {
          id: string
          converter_type: string
          date: string
          page_views: number
          file_selections: number
          conversions_started: number
          conversions_completed: number
          conversion_rate: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          converter_type: string
          date: string
          page_views?: number
          file_selections?: number
          conversions_started?: number
          conversions_completed?: number
          conversion_rate?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          converter_type?: string
          date?: string
          page_views?: number
          file_selections?: number
          conversions_started?: number
          conversions_completed?: number
          conversion_rate?: number
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      redirect_logs: {
        Row: {
          id: string
          source_url: string
          destination_url: string
          referrer: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_url: string
          destination_url: string
          referrer?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source_url?: string
          destination_url?: string
          referrer?: string | null
          user_agent?: string | null
          created_at?: string
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
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          last_sign_in_at: string | null
          app_metadata: Json
          user_metadata: Json
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          last_sign_in_at?: string | null
          app_metadata?: Json
          user_metadata?: Json
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          last_sign_in_at?: string | null
          app_metadata?: Json
          user_metadata?: Json
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
