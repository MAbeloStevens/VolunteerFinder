
import viewRoutes from './views.js'

const constructorMethod = (app) => {
  app.use(viewRoutes)
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;