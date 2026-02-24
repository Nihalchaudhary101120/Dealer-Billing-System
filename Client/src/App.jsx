import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/Register';
import { PublicRoute } from './Components/PublicRoute';
import ProtectedRoute from './Components/ProtectedRoute';
import SignInPage from './pages/SignIn';

function App() {

  return (
    <>
      <Routes>
        <Route path='/signin' index element={<PublicRoute> <SignInPage /></PublicRoute>} />


        <Route path='/register' element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Dashboard />} />

        </Route>

      </Routes>

    </>
  );
}

export default App
