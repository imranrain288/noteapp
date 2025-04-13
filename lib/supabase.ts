import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Profile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
};

export type Folder = {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    updated_at: string;
};

export type Document = {
    id: string;
    title: string;
    content: string | null;
    folder_id: string | null;
    user_id: string;
    is_published: boolean;
    is_archived: boolean;
    cover_image: string | null;
    icon: string | null;
    created_at: string;
    updated_at: string;
};
