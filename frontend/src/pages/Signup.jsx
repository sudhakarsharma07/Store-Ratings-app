import React from 'react';
import { request } from '../api';

export default function Signup({ onSignup }){
  const [name,setName]=React.useState('');
  const [email,setEmail]=React.useState('');
  const [address,setAddress]=React.useState('');
  const [password,setPassword]=React.useState('');
  const [err,setErr]=React.useState('');
  async function submit(e){
    e.preventDefault();
    try{
      await request('/api/auth/signup', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name, email, address, password })
      });
      onSignup?.();
    }catch(err){ setErr(err.message); }
  }
  return <div className='card'>
    <h3>Signup</h3>
    {err && <div style={{color:'red'}}>{err}</div>}
    <form onSubmit={submit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Full Name (20-60 chars)' />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' />
      <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder='Address'></textarea>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' type='password' />
      <button>Signup</button>
    </form>
  </div>
}
