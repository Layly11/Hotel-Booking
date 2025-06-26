import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import { json, urlencoded } from 'body-parser'
import session from "express-session";
import RedisStore from 'connect-redis';
import {getRedisClient} from './helpers/redis'
import passport from "passport";
import passportConfig from './helpers/passport';
import routers from './routers'

const APP = () => {
const app = express()

app.use(express.json());
app.use(urlencoded({ extended: true }))
const redisClient = getRedisClient();

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myhotel:',
    ttl: 60 * 60 * 1000
});
app.use(session({
    secret: process.env.COOKIE_SECRET!,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
passportConfig(passport)
app.use(passport.session())

app.use(routers)
return app

}

export default APP