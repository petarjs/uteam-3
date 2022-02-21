import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './components/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { TeamContextProvider } from './components/Profile/Team/TeamContextProvider';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <TeamContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TeamContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
