const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function request(path, opts={}){
  const headers = opts.headers || {};
  const token = localStorage.getItem('token');
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(BASE + path, {...opts, headers});
  const data = await res.json();
  if(!res.ok) throw new Error(data.message || 'API error');
  return data;
}
