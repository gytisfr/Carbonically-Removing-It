import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Tracker from './pages/Tracker';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoutesPage from './pages/Routes';

function App() {
  return (
    <div className='w-full'>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Tracker />} />
          <Route path='/routes' element={<RoutesPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<h1>Page Not Found 404</h1>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
