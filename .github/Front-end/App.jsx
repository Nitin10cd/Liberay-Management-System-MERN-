import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Components/Login';
import Register from '../Components/Register';
import Userhome from '../Components/Userhome';
import Adminhome from '../Components/Adminhome';
import { useState, useEffect } from 'react';

function App() {
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserId(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login userId={userId} setUserId={setUserId} />} />
        <Route path="/" element={<Register />} />
        <Route path="/user/home" element={<Userhome userId={userId} setUserId={setUserId} />} />
        <Route path="/admin/home" element={<Adminhome />} />
      </Routes>
    </Router>
  );
}

export default App;
