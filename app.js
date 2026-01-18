import express from 'express';
import userRouter from './src/routes/user.route.js';
import { sequelize } from './src/config/SequelizeORM.js';
import './src/models/index.js'; // register models & associations
import { errorHandlingMiddleware } from './src/middlewares/errorHandling.middleware.js';
import authRouter from './src/routes/auth.route.js';
import categoryRouter from './src/routes/category.route.js';
import brandRouter from './src/routes/brand.route.js';


const app = express();
const ROUTE_URL = '/v1/api'

app.use(express.json()); // enable when you need JSON body parsing

app.use(ROUTE_URL+'/user', userRouter);
app.use(ROUTE_URL+'/auth', authRouter);
app.use(ROUTE_URL + '/category', categoryRouter)
app.use(ROUTE_URL + '/brand', brandRouter)

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync({alter:true}); // or { alter: true } in dev only
    console.log('Models synced');

    app.use(errorHandlingMiddleware);

    app.listen(PORT,'0.0.0.0', () => {
      console.log(`App is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
}

start();
