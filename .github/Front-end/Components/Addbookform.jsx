import React, { useState } from "react";
import '../Styles/Addbook.css';

const AddBookForm = ({ showAddBookForm, setShowAddBookForm }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    url: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/book/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      setFormData({ id: "", name: "", url: "", author: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-form-container">
      <h2 style={{ textAlign: "center" }}>Add Book</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="Enter Book ID"
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Book Name"
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="Enter Book URL"
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter Author Name"
            required
          />
        </div>
        <div className="addbookformbtns">
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>
          <button
            type="button"
            className="close-button"
            onClick={() => setShowAddBookForm(!showAddBookForm)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
