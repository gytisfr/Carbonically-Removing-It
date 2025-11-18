import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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

function App() {
  return (
    <div className='w-full'>
      <Router>
        <Navbar />
        <Divider />
        <Routes>
          <Route path='/' element={<Tracker />} />
          <Route path='/routes' element={<RoutesPage />} />
          <Route path='/clients' element={<ClientsPage />} />
          <Route path='/drivers' element={<DriversPage />} />
          <Route path='/trucks' element={<TrucksPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='*' element={<h1>Page Not Found 404</h1>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
