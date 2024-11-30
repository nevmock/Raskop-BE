import TestController from './test-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';


class TestRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [tryCatch(TestController.index)]);
        this.router.post('/', [tryCatch(TestController.create)]);
        this.router.get('/:test_id', [tryCatch(TestController.show)]);
        this.router.put('/:test_id', [tryCatch(TestController.update)]);
        this.router.delete('/:test_id', [tryCatch(TestController.delete)]);
   }
}

export default new TestRoutes().router;