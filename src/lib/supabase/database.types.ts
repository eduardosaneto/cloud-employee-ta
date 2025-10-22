export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      buyer_personas: {
        Row: {
          department: string | null
          id: string
          icp_id: string | null
          pain_points: string[] | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          department?: string | null
          id?: string
          icp_id?: string | null
          pain_points?: string[] | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          department?: string | null
          id?: string
          icp_id?: string | null
          pain_points?: string[] | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_personas_icp_id_fkey"
            columns: ["icp_id"]
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_personas_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          name: string | null
          summary: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          name?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          name?: string | null
          summary?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      icps: {
        Row: {
          company_id: string | null
          company_size: string[] | null
          created_at: string | null
          description: string | null
          funding_stages: string[] | null
          geographic_regions: string[] | null
          id: string
          industries: string[] | null
          revenue_range: string[] | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          company_size?: string[] | null
          created_at?: string | null
          description?: string | null
          funding_stages?: string[] | null
          geographic_regions?: string[] | null
          id?: string
          industries?: string[] | null
          revenue_range?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          company_size?: string[] | null
          created_at?: string | null
          description?: string | null
          funding_stages?: string[] | null
          geographic_regions?: string[] | null
          id?: string
          industries?: string[] | null
          revenue_range?: string[] | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icps_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icps_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prospects: {
        Row: {
          company_name: string | null
          created_at: string | null
          domain: string
          id: string
          scraped_data: Json | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          domain: string
          id?: string
          scraped_data?: Json | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          domain?: string
          id?: string
          scraped_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      qualifications: {
        Row: {
          generated_at: string | null
          id: string
          icp_id: string | null
          prospect_id: string | null
          reasoning: string | null
          score: number | null
          status: string
          user_id: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          icp_id?: string | null
          prospect_id?: string | null
          reasoning?: string | null
          score?: number | null
          status?: string
          user_id?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          icp_id?: string | null
          prospect_id?: string | null
          reasoning?: string | null
          score?: number | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qualifications_icp_id_fkey"
            columns: ["icp_id"]
            referencedRelation: "icps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qualifications_prospect_id_fkey"
            columns: ["prospect_id"]
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qualifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}