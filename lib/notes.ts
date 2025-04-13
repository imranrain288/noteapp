import { supabase } from './supabase';
import { Document, Folder } from './supabase';

export const notesService = {
  async createFolder(name: string, userId: string): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFolders(userId: string): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createDocument(
    title: string,
    content: string | null,
    userId: string,
    folderId?: string
  ): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        title,
        content,
        user_id: userId,
        folder_id: folderId || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDocument(
    id: string,
    updates: Partial<Pick<Document, 'title' | 'content' | 'is_published' | 'is_archived' | 'cover_image' | 'icon'>>
  ): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getDocuments(userId: string, folderId?: string): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false });

    if (folderId) {
      query = query.eq('folder_id', folderId);
    } else {
      query = query.is('folder_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getArchivedDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPublishedDocuments(): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async searchDocuments(
    userId: string,
    query: string
  ): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
