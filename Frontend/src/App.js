import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp'; // Import SignUp
import JobBoard from './JobBoard';
import JobDetail from './JobDetail';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/admin"> <AdminDashboard /> </Route>
        <Route path="/jobs/:jobId"> <JobDetail /> </Route>
        <Route path="/jobs"> <JobBoard /> </Route>
        <Route path="/signup"> <SignUp /> </Route>
        <Route path="/"> <Login/> </Route>
      </Switch>
    </Router>
  );
}

export default App;
