import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { JwtPayload as NodeJwtPayload } from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import { UserModel } from '@hotel/models'
import dotenv from 'dotenv'

dotenv.config()

interface CustomJwtPayload extends NodeJwtPayload {
    id: string,
    username: string,
    email: string
}

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!
}


export default (passport: PassportStatic) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload: CustomJwtPayload, done) => {
            try{
                const user = await UserModel.findByPk(jwt_payload.id)

                if (user) {
                    return done(null, user);
                }
                 return done(null, false);
            } catch (error) {
                console.error(error);
                return done(error, false);
            }
        })
    )
}