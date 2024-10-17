import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pass from './components/Pass';
import Registration from './components/Registration';
// import CheckOut from './components/CheckOut';
// import CheckIn from './components/CheckIn';
import Reports from './components/Reports';
import StudentDetails from './components/StudentDetails';
import './App.css';  // Import the App styles
import Checkingate from './components/Checkingate';
import Outpass from './components/Outpass';
import Checkinout from './components/Checkinout';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Route */}
          <Route path='/login' element={<Login />} />

          {/* Protected Routes */}
          <Route 
            path="/pass" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Pass />
                </div>
              </PrivateRoute>
            } 
          />
          <Route
            path="/outpass" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Outpass />
                </div>
              </PrivateRoute>
            } 
          />
           <Route 
            path="/" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Home />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Registration />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/checkingate" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Checkingate />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/checkinout" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Checkinout />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <Reports />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/student-details" 
            element={
              <PrivateRoute>
                <div>
                  <div className="header">Gate Pass Generation</div>
                  <Navbar />
                  <StudentDetails />
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
