'use client';

import { createEdgeStoreProvider } from '@edgestore/react';

/**
 * EdgeStore provider configuration
 * Handles file uploads and storage
 * Uses default endpoint at /api/edgestore
 */
const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider({
  // Maximum number of concurrent uploads
  maxConcurrentUploads: 3,
});

export { EdgeStoreProvider, useEdgeStore };
