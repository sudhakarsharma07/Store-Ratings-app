import React from 'react';
import { request } from '../api';

export default function StoreList(){
  const [stores,setStores]=React.useState([]);
  const [q,setQ]=React.useState('');
  const [err,setErr]=React.useState('');
  const user = JSON.parse(localStorage.getItem('user')||'null');
  React.useEffect(()=>{ fetchStores(); },[]);
  async function fetchStores(){
    try{
      const data = await request('/api/stores');
      setStores(data);
    }catch(err){ setErr(err.message); }
  }
  async function submitRating(storeId, score){
    try{
      await request('/api/ratings/'+storeId, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ score }) });
      fetchStores();
    }catch(err){ setErr(err.message); }
  }
  return <div>
    <div className='card'>
      <input placeholder='Search name or address' value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={async ()=>{
        try{
          const data = await request('/api/stores?q='+encodeURIComponent(q));
          setStores(data);
        }catch(err){ setErr(err.message); }
      }}>Search</button>
    </div>
    {err && <div style={{color:'red'}}>{err}</div>}
    {stores.map(s=> <div key={s._id} className='card'>
      <h4>{s.name}</h4>
      <div>{s.address}</div>
      <div>Avg Rating: {s.avgRating ?? 'N/A'} ({s.ratingCount})</div>
      <div>Your Rating: {s.userRating ?? 'Not rated'}</div>
      <div className='row'>
        <div className='col'>
          <select defaultValue='5' id={'sel-'+s._id}>
            <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
          </select>
        </div>
        <div className='col'><button onClick={()=>{
          const sel = document.getElementById('sel-'+s._id);
          submitRating(s._id, Number(sel.value));
        }}>Submit/Update Rating</button></div>
      </div>
    </div>)}
  </div>
}
