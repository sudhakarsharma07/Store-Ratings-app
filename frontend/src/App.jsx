
import React from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreList from './pages/StoreList';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

export default function App() {
  const [route, setRoute] = React.useState('stores');
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user') || 'null'));

  React.useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRoute('login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#2c3e50',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '20px' }}>Store App</h2>

        {!user && (
          <>
            <button onClick={() => setRoute('login')} style={btnStyle}>Login</button>
            <button onClick={() => setRoute('signup')} style={btnStyle}>Signup</button>
          </>
        )}

        {user && (
          <>
            <div style={{ marginBottom: '10px' }}>
              Hi, <b>{user.name}</b> <br />({user.role})
            </div>
            <button onClick={logout} style={btnStyle}>Logout</button>
          </>
        )}

        {/* Role-based links */}
        {user?.role === 'admin' && (
          <button onClick={() => setRoute('admin')} style={btnStyle}>Admin Dashboard</button>
        )}
        {user?.role === 'owner' && (
          <button onClick={() => setRoute('owner')} style={btnStyle}>Owner Dashboard</button>
        )}

        <button onClick={() => setRoute('stores')} style={btnStyle}>Stores</button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {route === 'login' && (
          <Login
            onLogin={(u) => {
              setUser(u);
              if (u.role === 'admin') setRoute('admin');
              else if (u.role === 'owner') setRoute('owner');
              else setRoute('stores');
            }}
          />
        )}
        {route === 'signup' && <Signup onSignup={() => setRoute('login')} />}
        {route === 'stores' && <StoreList />}
        {route === 'admin' && user?.role === 'admin' && <AdminDashboard />}
        {route === 'owner' && user?.role === 'owner' && <OwnerDashboard />}
      </div>
    </div>
  );
}

const btnStyle = {
  background: '#34495e',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left'
};
