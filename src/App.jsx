
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CampusMap from './pages/campusMap'
import Courses from './pages/Courses'
import Navbar from './components/Navbar'

function App() {

  return (
    <>

    <Navbar />

    <Routes>

      <Route path="/" element={ <Home /> } />
      <Route path='/campus-map' element={ <CampusMap /> } />
      <Route path='/courses' element={ <Courses /> } />


    </Routes>
      
    </>
  )
}

export default App
