/**
 * Database Types for SVGAI.org
 * 
 * NOTE: This file includes types for monitoring tables that are planned but not yet created:
 * - monitoring_metrics
 * - funnel_conversions  
 * - monitoring_alerts
 * - web_vitals_logs
 * - performance_alerts
 * - error_groups
 * - error_events
 * - synthetic_checks
 * - uptime_metrics
 * - analytics_events
 * - conversion_metrics
 * - redirect_logs
 * 
 * These types are kept to support the monitoring system code, which will be activated
 * when the tables are created. Remove these types only after confirming the monitoring
 * code has been removed or updated.
 */

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
          name: string | null
          updated_at: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          subscription_id: string | null
          current_period_end: string | null
          monthly_generation_limit: number | null
          monthly_generations_used: number | null
          last_generation_reset: string | null
          lifetime_credits_granted: number | null
          lifetime_credits_used: number | null
          monthly_credits: number | null
          monthly_credits_used: number | null
          credits_reset_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          updated_at?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_id?: string | null
          current_period_end?: string | null
          monthly_generation_limit?: number | null
          monthly_generations_used?: number | null
          last_generation_reset?: string | null
          lifetime_credits_granted?: number | null
          lifetime_credits_used?: number | null
          monthly_credits?: number | null
          monthly_credits_used?: number | null
          credits_reset_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          updated_at?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          subscription_id?: string | null
          current_period_end?: string | null
          monthly_generation_limit?: number | null
          monthly_generations_used?: number | null
          last_generation_reset?: string | null
          lifetime_credits_granted?: number | null
          lifetime_credits_used?: number | null
          monthly_credits?: number | null
          monthly_credits_used?: number | null
          credits_reset_at?: string | null
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
      daily_generation_limits: {
        Row: {
          id: number
          identifier: string
          identifier_type: string
          generation_date: string
          generation_type: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          identifier: string
          identifier_type: string
          generation_date?: string
          generation_type?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          identifier?: string
          identifier_type?: string
          generation_date?: string
          generation_type?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          id: string
          stripe_event_id: string
          event_type: string
          idempotency_key: string
          processed_at: string | null
          event_data: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          stripe_event_id: string
          event_type: string
          idempotency_key: string
          processed_at?: string | null
          event_data?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          stripe_event_id?: string
          event_type?: string
          idempotency_key?: string
          processed_at?: string | null
          event_data?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      payment_audit_log: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: Json
          stripe_event_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data: Json
          stripe_event_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_data?: Json
          stripe_event_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      generated_videos: {
        Row: {
          id: string
          user_id: string
          prompt: string
          video_url: string
          storage_path: string
          duration: number
          resolution: string
          credits_used: number
          expires_at: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          video_url: string
          storage_path: string
          duration?: number
          resolution?: string
          credits_used?: number
          expires_at: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          video_url?: string
          storage_path?: string
          duration?: number
          resolution?: string
          credits_used?: number
          expires_at?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          stripe_subscription_id: string
          stripe_customer_id: string
          status: string
          tier: string
          stripe_price_id: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          stripe_subscription_id: string
          stripe_customer_id: string
          status: string
          tier: string
          stripe_price_id: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: string
          tier?: string
          stripe_price_id?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      storage_cleanup_queue: {
        Row: {
          id: string
          storage_path: string
          bucket_name: string
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          storage_path: string
          bucket_name: string
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          storage_path?: string
          bucket_name?: string
          created_at?: string
          processed_at?: string | null
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
