// NOTE: NEED THIS FOR VERCEL TO MAKE ANGULAR SERVER WORKS

export default async (req, res) => {
  const { reqHandler } = await import('../dist/web/server/server.mjs');
  return reqHandler(req, res);
};
