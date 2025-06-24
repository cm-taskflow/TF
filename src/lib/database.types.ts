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
      clients: {
        Row: {
          id: string
          name: string
          legal_form: string
          vat_number: string
          nace_code: string | null
          fiscal_year_end: string
          language: 'NL' | 'FR' | 'EN'
          director_name: string
          director_email: string
          director_phone: string | null
          notifications: Json | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
          company_type: string | null
          business_type: string | null
          start_date: string | null
          social_security_number: string | null
          bank_account: string | null
          sector: string | null
          status: string | null
          risk_profile: string | null
          tax_regime: string | null
          accounting_type: string | null
          document_language: string | null
          billing_address: Json | null
          shipping_address: Json | null
          website: string | null
          social_media: Json | null
          assigned_accountant: string | null
          tags: string[] | null
          custom_fields: Json | null
          compliance_status: Json | null
          recurring_tasks: string[] | null
          btw_regime: string | null
          short_name: string | null
          client_code: string | null
          enterprise_number: string | null
          relation_type: string | null
          boekhouding_bij_klant: boolean | null
          boekhouding_mailbox: string | null
          boekhouding_toegangscode: string | null
          accounting_software: string | null
          invoice_due_days: number | null
          invoice_method: string | null
          invoice_template: string | null
          invoice_note: string | null
          discount_percentage: number | null
          peppol_status: string | null
          general_meeting_date: string | null
          registered_office: string | null
          rpr: string | null
          articles_deposit_date: string | null
          risk_analysis_date: string | null
          risk_analysis_extended: boolean | null
          risk_notes: string | null
          external_links: Json | null
          ubo_entries: Json | null
          mandates: Json | null
          labels: string[] | null
          directors: Json | null
          bookkeeping_access_code: string | null
          bookkeeping_mailbox: string | null
          registered_office_address: Json | null
          contact_person: string | null
          contact_email: string | null
          contact_phone: string | null
          fiscal_year_start: string | null
          intracommunity: boolean | null
          client_type: 'company' | 'person' | 'non-profit' | 'other' | null
          billing_method: 'fixed' | 'hourly' | 'subscription' | null
          billing_email: string | null
          client_number: string | null
          payment_terms: string | null
          end_date: string | null
        }
        Insert: {
          id?: string
          name: string
          legal_form: string
          vat_number: string
          nace_code?: string | null
          fiscal_year_end: string
          language?: 'NL' | 'FR' | 'EN'
          director_name: string
          director_email: string
          director_phone?: string | null
          notifications?: Json | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          company_type?: string | null
          business_type?: string | null
          start_date?: string | null
          social_security_number?: string | null
          bank_account?: string | null
          sector?: string | null
          status?: string | null
          risk_profile?: string | null
          tax_regime?: string | null
          accounting_type?: string | null
          document_language?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          website?: string | null
          social_media?: Json | null
          assigned_accountant?: string | null
          tags?: string[] | null
          custom_fields?: Json | null
          compliance_status?: Json | null
          recurring_tasks?: string[] | null
          btw_regime?: string | null
          short_name?: string | null
          client_code?: string | null
          enterprise_number?: string | null
          relation_type?: string | null
          boekhouding_bij_klant?: boolean | null
          boekhouding_mailbox?: string | null
          boekhouding_toegangscode?: string | null
          accounting_software?: string | null
          invoice_due_days?: number | null
          invoice_method?: string | null
          invoice_template?: string | null
          invoice_note?: string | null
          discount_percentage?: number | null
          peppol_status?: string | null
          general_meeting_date?: string | null
          registered_office?: string | null
          rpr?: string | null
          articles_deposit_date?: string | null
          risk_analysis_date?: string | null
          risk_analysis_extended?: boolean | null
          risk_notes?: string | null
          external_links?: Json | null
          ubo_entries?: Json | null
          mandates?: Json | null
          labels?: string[] | null
          directors?: Json | null
          bookkeeping_access_code?: string | null
          bookkeeping_mailbox?: string | null
          registered_office_address?: Json | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          fiscal_year_start?: string | null
          intracommunity?: boolean | null
          client_type?: 'company' | 'person' | 'non-profit' | 'other' | null
          billing_method?: 'fixed' | 'hourly' | 'subscription' | null
          billing_email?: string | null
          client_number?: string | null
          payment_terms?: string | null
          end_date?: string | null
        }
        Update: {
          id?: string
          name?: string
          legal_form?: string
          vat_number?: string
          nace_code?: string | null
          fiscal_year_end?: string
          language?: 'NL' | 'FR' | 'EN'
          director_name?: string
          director_email?: string
          director_phone?: string | null
          notifications?: Json | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          company_type?: string | null
          business_type?: string | null
          start_date?: string | null
          social_security_number?: string | null
          bank_account?: string | null
          sector?: string | null
          status?: string | null
          risk_profile?: string | null
          tax_regime?: string | null
          accounting_type?: string | null
          document_language?: string | null
          billing_address?: Json | null
          shipping_address?: Json | null
          website?: string | null
          social_media?: Json | null
          assigned_accountant?: string | null
          tags?: string[] | null
          custom_fields?: Json | null
          compliance_status?: Json | null
          recurring_tasks?: string[] | null
          btw_regime?: string | null
          short_name?: string | null
          client_code?: string | null
          enterprise_number?: string | null
          relation_type?: string | null
          boekhouding_bij_klant?: boolean | null
          boekhouding_mailbox?: string | null
          boekhouding_toegangscode?: string | null
          accounting_software?: string | null
          invoice_due_days?: number | null
          invoice_method?: string | null
          invoice_template?: string | null
          invoice_note?: string | null
          discount_percentage?: number | null
          peppol_status?: string | null
          general_meeting_date?: string | null
          registered_office?: string | null
          rpr?: string | null
          articles_deposit_date?: string | null
          risk_analysis_date?: string | null
          risk_analysis_extended?: boolean | null
          risk_notes?: string | null
          external_links?: Json | null
          ubo_entries?: Json | null
          mandates?: Json | null
          labels?: string[] | null
          directors?: Json | null
          bookkeeping_access_code?: string | null
          bookkeeping_mailbox?: string | null
          registered_office_address?: Json | null
          contact_person?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          fiscal_year_start?: string | null
          intracommunity?: boolean | null
          client_type?: 'company' | 'person' | 'non-profit' | 'other' | null
          billing_method?: 'fixed' | 'hourly' | 'subscription' | null
          billing_email?: string | null
          client_number?: string | null
          payment_terms?: string | null
          end_date?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          client_id: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          due_date: string | null
          assigned_to: string | null
          category: string | null
          estimated_hours: number | null
          actual_hours: number | null
          completed_at: string | null
          created_at: string | null
          updated_at: string | null
          client_info: Json
          type: string | null
          vat_number: string | null
          request: string | null
          request_details: string | null
          deadline: string | null
          price: number | null
          docs_checked: boolean | null
          fct_checked: boolean | null
          prep_checked: boolean | null
          scan_checked: boolean | null
          proc_checked: boolean | null
          send_checked: boolean | null
          arch_checked: boolean | null
          paid_checked: boolean | null
          recurrence: string | null
          doc_checked: boolean | null
          docschecked: boolean | null
          fctchecked: boolean | null
          prepchecked: boolean | null
          scanchecked: boolean | null
          procchecked: boolean | null
          sendchecked: boolean | null
          archchecked: boolean | null
          paidchecked: boolean | null
        }
        Insert: {
          id?: string
          client_id: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          assigned_to?: string | null
          category?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          client_info?: Json
          type?: string | null
          vat_number?: string | null
          request?: string | null
          request_details?: string | null
          deadline?: string | null
          price?: number | null
          docs_checked?: boolean | null
          fct_checked?: boolean | null
          prep_checked?: boolean | null
          scan_checked?: boolean | null
          proc_checked?: boolean | null
          send_checked?: boolean | null
          arch_checked?: boolean | null
          paid_checked?: boolean | null
          recurrence?: string | null
          doc_checked?: boolean | null
          docschecked?: boolean | null
          fctchecked?: boolean | null
          prepchecked?: boolean | null
          scanchecked?: boolean | null
          procchecked?: boolean | null
          sendchecked?: boolean | null
          archchecked?: boolean | null
          paidchecked?: boolean | null
        }
        Update: {
          id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          due_date?: string | null
          assigned_to?: string | null
          category?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          client_info?: Json
          type?: string | null
          vat_number?: string | null
          request?: string | null
          request_details?: string | null
          deadline?: string | null
          price?: number | null
          docs_checked?: boolean | null
          fct_checked?: boolean | null
          prep_checked?: boolean | null
          scan_checked?: boolean | null
          proc_checked?: boolean | null
          send_checked?: boolean | null
          arch_checked?: boolean | null
          paid_checked?: boolean | null
          recurrence?: string | null
          doc_checked?: boolean | null
          docschecked?: boolean | null
          fctchecked?: boolean | null
          prepchecked?: boolean | null
          scanchecked?: boolean | null
          procchecked?: boolean | null
          sendchecked?: boolean | null
          archchecked?: boolean | null
          paidchecked?: boolean | null
        }
      }
      user_clients: {
        Row: {
          user_id: string
          client_id: string
          created_at: string | null
        }
        Insert: {
          user_id: string
          client_id: string
          created_at?: string | null
        }
        Update: {
          user_id?: string
          client_id?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_status: 'active' | 'inactive' | 'prospect'
      client_type: 'company' | 'person' | 'non-profit' | 'other'
      vat_regime: 'monthly' | 'quarterly' | 'exempt'
      billing_method: 'fixed' | 'hourly' | 'subscription'
      risk_profile: 'low' | 'normal' | 'high'
      client_language: 'NL' | 'FR' | 'EN'
      task_frequency: 'monthly' | 'quarterly' | 'yearly'
      task_status: 'open' | 'planned' | 'completed' | 'delayed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}