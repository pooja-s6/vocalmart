import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';
import validateRequest from '../utils/validateRequest';

const router = Router();

router.post(
  '/register',
  [body('name').isString().trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString().notEmpty()],
  validateRequest,
  login
);

export default router;
