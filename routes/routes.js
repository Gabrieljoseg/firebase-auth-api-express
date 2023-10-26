import {Router} from 'express';
import {createUser} from './controllers/authcontroller';
import {checkIfAuthenticated} from './middlewares/auth-middleware';

const router = Router();
 
router.post('/auth/signup', createUser);
router.get('/curriculos', checkIfAuthenticated, async (_, res) => {
  return res.send(curriculos);
});
 
export default router;