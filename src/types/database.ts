// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project exists, regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type ArticleStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          email: string;
          is_admin: boolean;
        }>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          label: string;
          description: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          description?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<{
          slug: string;
          label: string;
          description: string;
          sort_order: number;
        }>;
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          image_url: string | null;
          author: string;
          status: ArticleStatus;
          is_featured: boolean;
          featured_position: number | null;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          content?: string;
          image_url?: string | null;
          author?: string;
          status?: ArticleStatus;
          is_featured?: boolean;
          featured_position?: number | null;
          view_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<{
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          image_url: string | null;
          author: string;
          status: ArticleStatus;
          is_featured: boolean;
          featured_position: number | null;
          view_count: number;
          published_at: string | null;
        }>;
        Relationships: [];
      };
      article_categories: {
        Row: {
          article_id: string;
          category_id: string;
        };
        Insert: {
          article_id: string;
          category_id: string;
        };
        Update: Partial<{
          article_id: string;
          category_id: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "article_categories_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          id: number;
          site_name: string;
          tagline: string;
          logo_url: string | null;
          footer_about: string;
          contact_phone: string;
          contact_email: string;
          contact_address: string;
          whatsapp_channel_url: string;
          facebook_url: string;
          instagram_url: string;
          twitter_url: string;
          youtube_url: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
        };
        Update: Partial<{
          site_name: string;
          tagline: string;
          logo_url: string | null;
          footer_about: string;
          contact_phone: string;
          contact_email: string;
          contact_address: string;
          whatsapp_channel_url: string;
          facebook_url: string;
          instagram_url: string;
          twitter_url: string;
          youtube_url: string;
        }>;
        Relationships: [];
      };
      ticker_items: {
        Row: {
          id: string;
          content: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<{
          content: string;
          sort_order: number;
          is_active: boolean;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
