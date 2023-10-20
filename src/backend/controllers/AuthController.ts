import {
    JsonController,
    OnUndefined,
    QueryParam,
    UseBefore,
    Body,
    Req,
    Res,
    Get,
    Delete,
    Post
} from 'routing-controllers';

import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { sign } from 'jsonwebtoken';
import { generateKeyPairSync, createSign, KeyObject } from 'crypto';
import bcrypt from "bcrypt";
import prisma from '../prisma';


@JsonController('/auth')
export class AuthController {

    @Post('/login')
    public async login(@Body({ validate: true, required: true }) body: any, @Req() req: any, @Res() res: any): Promise<any> {
        console.log('login')
        const user = await prisma.user.findFirst({
            where: { email: body.email }
        });

        if (!user) {
            return res.status(422).json({
                status: 'error',
                name: 'EmailNotFound',
                message: 'Your email not found'
            })
        }

        const isMatch = await bcrypt.compare(body.password, user.password)
        if (!isMatch) {
            return res.status(422).json({
                status: 'error',
                name: 'PasswordMismatch',
                message: 'Your password do not match'
            })
        }

        const { privateKey, publicKey } = generateKeyPairSync('ec', {
            namedCurve: 'sect239k1'
        });

        var signature = this.generateSignature(user, privateKey);

        const token = sign({ id: user.id, email: user.email, role: user.role }, signature, {
            expiresIn: 86400 // 24 hours
        });

        return res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken: token,
            signature: signature
        });

    }

    private generateSignature(user, privateKey: KeyObject) {
        const Sign = createSign('SHA256');
        Sign.write(`${user}`);
        Sign.end();
        return Sign.sign(privateKey, 'hex');
    }

    @Post('/register')
    public async register(@Body({ validate: true, required: true }) body: any, @Req() req: any, @Res() res: any): Promise<any> {
        try {
            const user = await prisma.user.create({
                data: {
                    email: body.email,
                    password: await bcrypt.hash(body.password, 10),
                    name: body.name,
                }
            }) 

            if (user) {
                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                });
            }

            return res.status(500).send({
                message: 'Something went wrong'
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    return res.status(400).send({
                        name: e.name,
                        message: 'Email already exists',
                        errors: e.meta
                    });
                }
            }
            throw e
        }
    }
}