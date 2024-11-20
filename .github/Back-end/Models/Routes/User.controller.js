const User = require('../Models/User.model');
const jwt = require('jsonwebtoken');
const IssueBook = require('../Models/IssuedBook.model');

const handleErrors = (err) => {
    let error = { email: '', password: '', name: '', role: '' };

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }

    if (err.code === 11000) {
        error.email = 'Email is already registered';
    }

    return error;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: maxAge });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already in use' });
        }

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(201).json({
            message: 'User successfully registered!',
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(500).json({ errors });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(200).json({
            message: 'Login successful!',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

const BookIssue = async (req, res) => {
    const { name, author, url, email } = req.body;
    try {
        const bookIssued = new IssueBook({ name, author, url, email });
        await bookIssued.save();
        res.status(201).json({ message: "Book issued successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { name, email, role } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email }, { name, role }, { new: true });
        if (!user) {
            res.status(401).json({ message: 'failed in updating the status of the user' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(401).json({ message: 'failed in updating the status of the user' });
    }
};

const logout_post = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(201).json({ message: 'your account is logout' });
};

module.exports = {
    registerUser,
    loginUser,
    BookIssue,
    updateUserProfile,
    logout_post
};
