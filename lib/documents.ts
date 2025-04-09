interface Document {
  title: string;
  userId: string;
  content?: string;
  coverImage?: string | null;
  icon?: string | null;
  isArchived?: boolean;
  isPublished?: boolean;
  parentDocumentId?: string;
  archivedAt?: Date | null;
}

export const createDocument = async (document: Document) => {
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error('Failed to create document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const getDocuments = async (query: { 
  userId: string;
  parentDocumentId?: string 
}) => {
  try {
    const response = await fetch(`/api/documents?userId=${query.userId}&parentDocumentId=${query.parentDocumentId || ''}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

export const getTrashDocuments = async (userId: string) => {
  try {
    const response = await fetch(`/api/documents?userId=${userId}&trash=true`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trash documents');
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting trash documents:", error);
    throw error;
  }
};

export const getDocument = async (documentId: string) => {
  try {
    const response = await fetch(`/api/documents/${documentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const updateDocument = async (documentId: string, updates: Partial<Document>) => {
  try {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const archiveDocument = async (documentId: string) => {
  try {
    const response = await fetch(`/api/documents/${documentId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to archive document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error archiving document:", error);
    throw error;
  }
};

export const restoreDocument = async (documentId: string) => {
  try {
    const response = await fetch(`/api/documents/${documentId}/archive`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to restore document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error restoring document:", error);
    throw error;
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};