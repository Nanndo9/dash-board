import validator from 'validator';

export const validateUserInput = (firstName: string, lastName: string, email: string, password: string) => {
    if (!firstName || !lastName || !email || !password) {
        return { valid: false, message: 'Missing required fields' };
    }

    if (!validator.isEmail(email)) {
        return { valid: false, message: 'Invalid email format' };
    }

    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }

    const passwordIsValid = validator.isStrongPassword(password, {
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    });

    if (!passwordIsValid) {
        return { valid: false, message: 'Password is not strong enough' };
    }

    return { valid: true };
};