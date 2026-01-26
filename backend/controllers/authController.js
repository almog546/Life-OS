const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

async function signup(req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });
        req.session.userId = user.id;
        res.status(201).json({ message: 'User created', user: { id: user.id } });
    }
    catch (error) {
        console.error('Signup Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.session.userId = user.id;
        res.status(200).json({ message: 'Login successful', user: { id: user.id } });
    }
    catch (error) {
        console.error('Login Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}

async function me(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
        res.status(200).json({ user });
    }
    catch (error) {
        console.error('Me Error:', error);
         res.status(500).json({ message: 'Internal server error' });
    }
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
}
module.exports = { signup, login, me, logout };