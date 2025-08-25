import React from 'react';
import { request } from '../api';

export default function AdminDashboard(){
  const [stats,setStats]=React.useState(null);
  const [users,setUsers]=React.useState([]);
  const [stores,setStores]=React.useState([]);
  const [err,setErr]=React.useState('');
  React.useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      setStats(await request('/api/admin/dashboard-stats'));
      setUsers(await request('/api/admin/users'));
      setStores(await request('/api/admin/stores'));
    }catch(err){ setErr(err.message); }
  }
  return <div>
    <h3>Admin Dashboard</h3>
    {err && <div style={{color:'red'}}>{err}</div>}
    {stats && <div className='card'>Users: {stats.users} | Stores: {stats.stores} | Ratings: {stats.ratings}</div>}
    <div className='card'>
      <h4>Users</h4>
      {users.map(u=> <div key={u._id}>{u.name} | {u.email} | {u.role}</div>)}
    </div>
    <div className='card'>
      <h4>Stores</h4>
      {stores.map(s=> <div key={s._id}>{s.name} | {s.address} | Avg: {s.avgRating ?? 'N/A'}</div>)}
    </div>
  </div>
}
