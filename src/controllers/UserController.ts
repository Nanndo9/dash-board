import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { HttpStatus } from '../enums/htppStatus';
import bcrypt from 'bcrypt';
import { validateUserInput } from '../utils/validation';
import validator from 'validator';
import { UserBalanceRepository } from '../repositories/userBalanceRepository';

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
                return res
                    .status(HttpStatus.BAD_REQUEST)
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
    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = await userRepository.findOne({
                where: { id },
                relations: ['transactions'],
            });
            if (!userId) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'User not found' });
            }
            return res.status(HttpStatus.OK).json(userId);
        } catch (error) {
            return res
                .status(HttpStatus.OK)
                .json({ message: 'Error when seeking users' });
        }
    }
    static async userUpdate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { password, email, ...updateData } = req.body;
            const user = await userRepository.findOne({ where: { id } });
            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'User not found' });
            }
            if (email) {
                const emailExists = await userRepository.findOne({
                    where: { email },
                });
                if (emailExists && emailExists.id !== id) {
                    return res
                        .status(HttpStatus.BAD_REQUEST)
                        .json({ message: 'Email is already in use' });
                }
                updateData.email = email;
            }
            if (password) {
                if (password.length < 6) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: 'Password must be at least 6 characters long',
                    });
                }

                const passwordIsValid = validator.isStrongPassword(password, {
                    minLength: 6,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 0,
                });

                if (!passwordIsValid) {
                    return res
                        .status(HttpStatus.BAD_REQUEST)
                        .json({ message: 'Password is not strong enough' });
                }

                updateData.password = await bcrypt.hash(password, 8);
            }

            await userRepository.update(id, updateData);
            const updatedUser = await userRepository.findOne({ where: { id } });
            return res.status(HttpStatus.OK).json(updatedUser);
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error updating user', error });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ message: 'User not found' });
        }

        await userRepository.delete(user);
        return res
            .status(HttpStatus.OK)
            .json({ message: 'successful deleted user' });
    }
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'User not found' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'Invalid password' });
            }

            return res
                .status(HttpStatus.OK)
                .json({ message: 'Login successful' });
        } catch {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when logging in' });
        }
    }

    static async logout(req: Request, res: Response) {
        return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
    }

    static async postgresGetUserBalance(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userBalanceRepository = new UserBalanceRepository();
            const balance = await userBalanceRepository.getUserBalance(id);

            return res.status(HttpStatus.OK).json(balance);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user balance', error });
        }
    }
}
