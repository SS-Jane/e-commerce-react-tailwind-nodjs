import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, BrowserRouter as Router, RouterProvider } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';

const router = createBrowserRouter([
  {
    path : '/',
    element : <SignIn />
  },
  {
    path : '/auth/signin',
    element : <SignIn />
  },
  {
    path : '/auth/signup',
    element : <SignUp />
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <Router>
      <App />
    </Router> */}
  </React.StrictMode>,
);
