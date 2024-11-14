const TestController = require('./test-controller');
const BaseRoutes = require('../../base_classes/base-routes');
const tryCatch = require('../../utils/tryCatcher');


class TestRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [tryCatch(TestController.index)]);
        this.router.post('/', [tryCatch(TestController.create)]);
        this.router.get('/:test_id', [tryCatch(TestController.show)]);
        this.router.put('/:test_id', [tryCatch(TestController.update)]);
        this.router.delete('/:test_id', [tryCatch(TestController.delete)]);
   }
}

module.exports = new TestRoutes().router;