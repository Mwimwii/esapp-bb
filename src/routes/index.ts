import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response, _next: Function) => {
  res.status(200).json({
    app: 'titl'
  })
});


export default router;
