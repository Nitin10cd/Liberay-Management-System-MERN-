import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import '../Styles/Home.css';

const Userhome = ({ userId, setUserId }) => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/book/add');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBooks();
  }, []);

  const handleIssueBook = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedBook.name,
          author: selectedBook.author,
          url: selectedBook.url,
          email: userId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to issue book');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (books.length === 0) {
    return <div className="loading-message">Loading books...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="userhome-container">
        <div className="book-list">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img src={book.url} alt={book.name} className="book-image" />
              <div className="book-info">
                <p className="book-title">{book.name}</p>
                <p className="book-author">Author: {book.author}</p>
                <button onClick={() => handleIssueBook(book)}>Issue Book</button>
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Issue Book</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Book Name: </label>
                  <input type="text" value={selectedBook.name} disabled />
                </div>
                <div>
                  <label>Author: </label>
                  <input type="text" value={selectedBook.author} disabled />
                </div>
                <div>
                  <label>Book URL: </label>
                  <input type="text" value={selectedBook.url} disabled />
                </div>
                <div>
                  <label>User ID: </label>
                  <input type="text" value={userId} required />
                </div>
                <div className="issueButtons">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Userhome;
