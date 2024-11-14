import { Router } from 'express';

class BaseRoutes {
   router;

   constructor() {
      this.router = Router();
      this.routes();
   }
}

export default BaseRoutes;