import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

// Initialize EdgeStore
const es = initEdgeStore.create();

// Create a router with bucket definitions
const edgeStoreRouter = es.router({
  // Define buckets for file storage
  publicFiles: es.fileBucket(),
  // Add more buckets as needed
});

// Create and export the API handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };
