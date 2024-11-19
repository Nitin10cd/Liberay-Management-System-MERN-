import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Single.css";

const SingleUser = ({ userComp, singlUserPage, setsinglUserPage }) => {
  const [Books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/book/showuserbook", {
          params: { email: userComp.email },
        });
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, [userComp.email]);

  const handleClick = () => {
    setsinglUserPage(false);
  };

  const returnBook = async (bookId) => {
    try {
      const response = await axios.delete(`/api/book/returnbook/${bookId}`);
      if (response.status === 200) {
        alert("Book returned successfully");
        setBooks((prev) => prev.filter((book) => book._id !== bookId));
      } else {
        throw new Error("Failed to return the book.");
      }
    } catch (err) {
      console.error("Error returning the book:", err);
      alert("Error returning the book. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/book/deleteuseracc/${userId}`);
      if (response.status === 200) {
        alert(`User account with ID ${userId} is deleted.`);
        setsinglUserPage(false);
      }
    } catch (err) {
      console.error(`Error deleting user: ${err}`);
      alert("Error deleting user. Please try again.");
    }
  };

  return (
    <div className="single-user-containerSingle">
      <div className="user-cardSingle">
        <h4>User Details</h4>
        <p>
          <strong>Name:</strong> {userComp.name}
        </p>
        <p>
          <strong>Email:</strong> {userComp.email}
        </p>
        <p>
          <strong>Phone:</strong> {userComp.phone}
        </p>
        <div className="action-buttonsSingle">
          <button className="buttonSingle close-buttonSingle" onClick={handleClick}>
            Close
          </button>
          <button 
            className="buttonSingle delete-buttonSingle" 
            onClick={() => deleteUser(userComp._id)}
          >
            Delete User
          </button>
        </div>
      </div>

      <div className="user-booksSingle">
        <h2>Issued Books of {userComp.name}</h2>
        {Books.length === 0 ? (
          <p>No books found for this user.</p>
        ) : (
          <div className="book-list-gridSingle">
            {Books.map((book) => (
              <div key={book._id} className="book-cardSingle">
                <img src={book.url} alt={book.name} className="book-imageSingle" />
                <div className="book-infoSingle">
                  <h3 style={{ fontSize: "18px" }}>{book.name}</h3>
                  <p>Author: {book.author}</p>
                  <button onClick={() => returnBook(book._id)} className="buttonSingle">
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;
