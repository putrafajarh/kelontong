import 'reflect-metadata';
import { Application, urlencoded } from 'express';
import { createExpressServer } from 'routing-controllers';
import path from 'path';
import * as dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './prisma';
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

dotenv.config({
    path: path.join(__dirname, "../../.env"),
})

const app: Application = createExpressServer({
    cors: true,
    classTransformer: true,
    routePrefix: "/api",
    defaultErrorHandler: false,
    controllers: [path.join(__dirname, "/controllers/*.js")],
    middlewares: [path.join(__dirname, "/middlewares/*.js")],
    interceptors: [path.join(__dirname, "/interceptors/*.js")],
});

app.use(urlencoded({extended: false}))

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie : { secure : true, maxAge : (4 * 60 * 60 * 1000) }
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async(username, password, done) => {
    console.log('localStrategy')
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: username
            }
        })

        if (!user) {
            return done(null, false, { message: "No user found" })
        }

        console.log('password', password, user.password)

        const isMatch = await bcrypt.compare(password, user.password)
        console.log('isMatch', isMatch)

        if (!isMatch) {
            return done(null, false, { message: "Wrong password" })
        }

        return done(null, user)

    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return done(null, false, { message: "No user found" })
            }
        }
    }

    done(null, false, { message: "Something went wrong" })
}));

passport.serializeUser((user: any, done) => { 
    console.log(`--------> Serialize User`)
    console.log(user)     

    done(null, user.id);
});

passport.deserializeUser(async(id: string, done) => {
    console.log("---------> Deserialize Id")
    console.log(id)

    const user = await prisma.user.findFirst({
        where: {
            id
        }
    })

    if (user) {
        done (null, user)
    } else {
        done(null, false)
    }
}) 

app.get('/dashboard', (req, res) => {
    return res.json({
        sempak: true
    })
});

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/sem' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.post("/login", passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/sempak",
}))

const port = process.env.APP_PORT || 2000;
app.listen(port, () => {
    console.log(`[server] Server started on port ${port}`);
});