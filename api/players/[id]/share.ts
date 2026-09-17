import { app } from '../../../server';
import { handle } from 'hono/vercel';

// Keep the public share URL as an explicit Vercel dynamic function route.
// The root catch-all is retained for the one-segment API endpoints, while
// this entry point guarantees that /api/players/:id/share is deployed too.
export const config = { runtime: 'edge' };
export default handle(app);
