import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Board from './pages/Board';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Boards from './pages/Boards';
import Register from './pages/Register';
import Users from './pages/Users';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="boards" element={<Boards />} />
          <Route path="board" element={<Board />} />
          <Route path="users" element={<Users />} />
          <Route path="board" element={<Board />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
