import React from 'react';
import { request } from '../api';

export default function OwnerDashboard(){
  const [stores,setStores]=React.useState([]);
  const [err,setErr]=React.useState('');
  const user = JSON.parse(localStorage.getItem('user')||'null');
  React.useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      // get owner's stores via admin stores and filter (simple demo)
      const all = await request('/api/stores');
      const mine = all.filter(s => s.owner === (user?.id || user?._id));
      setStores(mine);
    }catch(err){ setErr(err.message); }
  }
  return <div>
    <h3>Owner Dashboard</h3>
    {err && <div style={{color:'red'}}>{err}</div>}
    {stores.map(s=> <div key={s._id} className='card'>
      <h4>{s.name}</h4>
      <div>Avg Rating: {s.avgRating ?? 'N/A'} | Ratings Count: {s.ratingCount}</div>
      <button onClick={async ()=>{
        try{
          const ratings = await request('/api/ratings/store/'+s._id);
          alert(JSON.stringify(ratings.map(r=>({name:r.user.name, score:r.score})), null, 2));
        }catch(err){ setErr(err.message); }
      }}>View Ratings</button>
    </div>)}
  </div>
}
