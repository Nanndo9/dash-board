import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { HttpStatus } from '../enums/htppStatus';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { validateUserInput } from '../utils/validation';
export class UserController {
    static async createUser(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password, transactions } =
                req.body;

            const validation = validateUserInput(
                firstName,
                lastName,
                email,
                password
            );
            if (!validation.valid) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({ message: validation.message });
            }
            const userExists = await userRepository.findOneBy({ email });

            if (userExists) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'User already exists' });
            }
            const passwordHash = await bcrypt.hash(password, 8);
            const userCreation = userRepository.create({
                firstName,
                lastName,
                email,
                password: passwordHash,
                transactions,
            });
            await userRepository.save(userCreation);

            const { password: _, ...user } = userCreation;
            return res.status(HttpStatus.OK).json(user);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when creating user', error });
        }
    }
    static async getAllUsers(_: Request, res: Response) {
        try {
            const users = await userRepository.find({
                relations: ['transactions'],
            });
            return res.status(HttpStatus.OK).json(users);
        } catch (error) {
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Error when seeking users', error });
        }
    }

}
