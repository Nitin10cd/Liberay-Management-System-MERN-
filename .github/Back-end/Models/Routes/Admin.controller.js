const BookModel = require('../Models/Book.model');
const Issued = require('../Models/IssuedBook.model');
const User = require('../Models/User.model');
require('mongoose')

// Function to handle errors from MongoDB or validation
const handleErrors = (err) => {
    let error = { email: '', password: '', name: '', role: '' };

    if (err.message.includes('Book validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }

    if (err.code === 11000) {
        error.id = 'Book with this ID already exists';
    }

    return error;
};

// Show all books
const ShowBook = async (req , res) => {
    try {
        const Books = await BookModel.find();
        res.status(200).json(Books); 
    } catch (err) {
        console.error('Error fetching books:', err.message);
        res.status(500).json({ 'error': 'Error fetching books' });
    }
};

// Add a new book to the database
const AddBookToDB = async (req, res) => {
    const { id, name, url, author } = req.body;

    if (!name || !id || !url || !author) {
        return res.status(400).json({ message: 'Please fill out all fields' });
    }

    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(url)) {
        return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    try {
        const checkBookIsAlready = await BookModel.findOne({ id });
        if (checkBookIsAlready) {
            return res.status(400).json({ message: 'Book already available' });
        }

        const newBook = new BookModel({ id, name, url, author });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully' });

    } catch (err) {
        console.error('Error adding book:', err.message);
        const errors = handleErrors(err);
        res.status(500).json({ errors });
    }
};

// Get records of users who have issued books
const GetUserRecords = async (req , res) => {
    try {
        const Users = await Issued.find();
        if (Users) {
            res.status(200).json(Users); 
        }
    } catch (err) {
        console.error('Error fetching user records:', err.message);
        res.status(500).json({ 'error': 'Error in finding records' });
    }
};

// Get details of a specific user by email
const getUser = async (req , res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ 'message': 'Email not found' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 'message': 'User not found' });
        }
        res.status(200).json(user); 
    } catch (err) {
        console.error('Error fetching user:', err.message);
        res.status(500).json({ 'message': 'Error retrieving user' });
    }
};

// Get all books issued by a specific user
const getUserBooks = async (req, res) => {
    const { email } = req.query;
    try {
        if (!email) {
            return res.status(400).json({ 'message': 'Email not found' });
        }
        
        const Books = await Issued.find({ email });
        if (!Books || Books.length === 0) {
            return res.status(404).json({ 'message': 'No books found for this user' });
        }
        res.status(200).json(Books); 
    } catch (err) {
        console.error('Error fetching books for user:', err.message);
        res.status(500).json({ 'message': 'Error retrieving user books' });
    }
};

// Route for the return book 
const returnBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const deletedBook = await Issued.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found in issued records." });
        }

        res.status(200).json({ message: "Book returned successfully.", book: deletedBook });
    } catch (err) {
        console.error("Error returning book:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Show all the users / members who have books or not
const showAllUsers = async (req , res) => {
    try {
        const Members  = await User.find();
        if (!Members) {
            res.status(401).json({message : 'Error in fetching the user details'});
        } else {
            res.status(200).json(Members);
        }
    } catch (err) {
        res.status(401).json({message : 'Error in fetching the user details'});
    }
};

// Delete user account and associated issued books
const deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        console.log(user);

        const userEmail = user.email;
        console.log(userEmail);

        const deletedBooks = await Issued.deleteMany({ email: userEmail });
        console.log(deletedBooks);

        if (deletedBooks.deletedCount === 0) {
            return res.status(404).json({ message: "No issued books found for this user." });
        }

        const deletedUser = await User.deleteOne({ _id: userId });
        if (!deletedUser.deletedCount) {
            return res.status(404).json({ message: "User not found or already deleted." });
        }

        res.status(200).json({ message: "User account and all issued books deleted successfully." });
    } catch (err) {
        console.error("Error deleting user account:", err);
        res.status(500).json({ message: "Error deleting user account and issued books." });
    }
};

// Controller for getting database records: total books issued, total members, total books available
const dataBaseRecords = async (req , res) => {
    try {
        const totalIssuers  = await Issued.countDocuments();
        const totalMembers = await User.countDocuments();
        if (!totalIssuers || !totalMembers) {
            res.status(401).json({message : "Error in getting the record"});
        }
        const reportData = {
            totalIssuers,
            totalMembers
        };
        res.status(200).json(reportData);
    } catch (err) {
        res.status(401).json({message : "Error in getting the record"});
    }
};

// Update admin profile details
const updateAdminProfile = async (req , res) => {
    const {name , email , role} = req.body;
    try {
        const user = await User.findOneAndUpdate({email} , {name , role} , {new : true});
        if (!user) {res.status(401).json({message: 'Failed in updating the status of the user'})}
        res.status(200).json(user);
    } catch (err) {
        res.status(401).json({message: 'Failed in updating the status of the user'})
    }
};

// Controller for searching books by name or author
const searchBook = async (req, res) => {
    const { name, author } = req.query;  
    try {
        let searchCriteria = {};

        if (name) {
            searchCriteria.name = { $regex: name, $options: 'i' };  
        }

        if (author) {
            searchCriteria.author = { $regex: author, $options: 'i' };  
        }

        const books = await BookModel.find(searchCriteria);

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found." });
        }

        res.status(200).json(books);
    } catch (err) {
        console.error("Error searching books:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { 
    AddBookToDB, 
    ShowBook, 
    GetUserRecords, 
    getUser, 
    getUserBooks ,
    returnBook,
    showAllUsers,
    deleteUserAccount,
    dataBaseRecords,
    updateAdminProfile,
    searchBook
};
