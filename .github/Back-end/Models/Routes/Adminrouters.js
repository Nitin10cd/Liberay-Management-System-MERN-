const express = require('express');
const {AddBookToDB , ShowBook, GetUserRecords, getUser , dataBaseRecords , getUserBooks, returnBook, showAllUsers, deleteUserAccount } = require('../Controllers/Admin.controller');
const router = express.Router();;

// routes routers 
router.get('/add' , ShowBook);
router.post('/add', AddBookToDB);
router.get('/showrecord' ,GetUserRecords );
router.post('/getuserdata' , getUser);
router.get('/showuserbook' , getUserBooks);
router.delete('/returnbook/:bookId', returnBook);     
router.get('/showallmembers' , showAllUsers);
router.delete('/deleteuseracc/:userId' , deleteUserAccount);
router.get('/getdbrecord' , dataBaseRecords);




module.exports = router;
