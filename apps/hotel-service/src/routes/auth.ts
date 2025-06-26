import express, { Request, Response, NextFunction } from 'express';
import * as jose from 'jose'
import passport from 'passport';
import { UserModel } from '@hotel/models'
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({ msg: 'Please enter all fields' });
      return
    } 
    try {
        let userByEmail = await UserModel.findOne({where: { email } })
        if (userByEmail) {
            res.status(400).json({ msg: 'User with this email already exists' });
            return
        }
        let userByUsername = await UserModel.findOne({ where: { username } });
        if (userByUsername) {
            res.status(400).json({ msg: 'Username already exists' });
            return
        }

         const newUser = await UserModel.create({ username, email, password });
         res.status(201).json({ msg: 'User registered successfully', userId: newUser.id });
    } catch (error) {
      res.status(500).send('Server Error');
      next(error)
    }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({ msg: 'Please enter all fields' });
        return
    }

    try {
        const user = await UserModel.findOne({where: { email }})
        if (!user) {
          res.status(400).json({ msg: 'Invalid Credentials' });
          return
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            res.status(400).json({ msg: 'Invalid Credentials' });
            return
        }

        const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const token = await new jose.SignJWT({
            id: user.id,
            username: user.username,
            email: user.email
        })
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN!)
        .sign(jwtSecret)

        res.json({ token });
    } catch (error) {
        next(error)
        res.status(500).send('Server Error');
    }
})

router.get(
    '/current-user',
    passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response, next: NextFunction) => {
        res.json({ user: req.user });
    }
)

export default router;