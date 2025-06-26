import express, { Request, Response, NextFunction } from 'express';
import * as jose from 'jose'
import passport from 'passport';
import { UserModel } from '@hotel/models'


const router = express.Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password } = req.body
    console.log("Req_Body: ", req.body)
    console.log("JWT_SECRET: ", process.env.JWT_SECRET)
    if (!username || !email || !password) {
      res.status(400).json({ msg: 'Please enter all fields' });
      next()
    } 
    try {
         const newUser = await UserModel.create({ username, email, password });
         console.log('User Created:');
         res.status(201).json({ msg: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).send('Server Error');
        next(error);
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