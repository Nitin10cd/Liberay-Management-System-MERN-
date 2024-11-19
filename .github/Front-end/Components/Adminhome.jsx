import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import AddBookForm from './AddBookForm';
import axios from 'axios';
import '../Styles/Admin.css';
import SingleUser from './SinglUser';

const Adminhome = ({ userId, setUserId }) => {
  const [UserData, setUserData] = useState([]);
  const [userComp, setuserComp] = useState(null);
  const [singlUserPage, setsinglUserPage] = useState(false);
  const [error, setError] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(true);
  const [records, setrecords] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/book/showrecord');
        if (!response.ok) {
          throw new Error('Failed to get the user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const dataRecords = async () => {
    try {
      const response = await axios.get('/api/book/getdbrecord');
      setrecords(response);
      console.log(records);
    } catch (err) {
      console.log(err);
    }
  };

  const HandleTableSubmit = async (user) => {
    console.log('User details clicked:', user.email);

    try {
      const response = await axios.post('/api/book/getuserdata', { email: user.email });
      const data = response.data;
      if (data) {
        setuserComp(data);
        console.log('User details:', data);
      } else {
        setError('User details not found.');
      }
    } catch (err) {
      setError('Error fetching user details.');
      console.error('Error fetching user details:', err);
    }

    setsinglUserPage(true);
  };

  return (
    singlUserPage ? (
      <SingleUser
        userComp={userComp}
        singlUserPage={singlUserPage}
        setsinglUserPage={setsinglUserPage}
      />
    ) : (
      <div>
        <NavBar />
        <button
          style={{ marginRight: '10px', marginLeft: '10px' }}
          className="add-book-button"
          onClick={() => setShowAddBookForm((prev) => !prev)}
        >
          {showAddBookForm ? 'Hide Add Book Form' : 'Add Book to DB'}
        </button>
        {showAddBookForm && (
          <AddBookForm
            showAddBookForm={showAddBookForm}
            setShowAddBookForm={setShowAddBookForm}
          />
        )}
        <button
          className="view-all-button"
          onClick={() => setShowAllUsers((prev) => !prev)}
        >
          {showAllUsers ? 'Hide All Records' : 'View All Records'}
        </button>
        {showAllUsers && (
          <div>
            <h3 style={{ textAlign: 'center' }}>User Data</h3>
            {error && <p className="error-message">{error}</p>}
            {UserData.length === 0 ? (
              <p>No user data available</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {UserData.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button onClick={() => HandleTableSubmit(user)}>
                          User Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default Adminhome;
