import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Tracker from './pages/Tracker';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoutesPage from './pages/Routes';
import ClientsPage from './pages/Clients';
import DriversPage from './pages/Drivers';
import TrucksPage from './pages/Trucks';
import Divider from './components/divider';

function AppWrapper() {
  const location = useLocation();
  const hideNavFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {!hideNavFooter && <Divider />}

      <Routes>
        {/* Public routes */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Tracker />
            </ProtectedRoute>
          }
        />
        <Route
          path='/routes'
          element={
            <ProtectedRoute>
              <RoutesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/clients'
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/drivers'
          element={
            <ProtectedRoute>
              <DriversPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/trucks'
          element={
            <ProtectedRoute>
              <TrucksPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path='*' element={<h1>Page Not Found 404</h1>} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
