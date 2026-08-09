export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/project') return new Response('Not found', { status: 404 });
    if (origin !== 'https://nikobutcooler.github.io') return new Response('Forbidden', { status: 403 });
    let data;
    try { data = await request.json(); } catch { return out({error:'Invalid request'},400,origin); }
    const name=String(data.name||'').trim(), email=String(data.email||'').trim(), message=String(data.message||'').trim();
    if(!name||!email||!message||name.length>100||email.length>200||message.length>5000) return out({error:'Please fill in all fields.'},400,origin);
    const r=await fetch('https://api.github.com/repos/nikobutcooler/nikobutcooler.github.io/issues',{method:'POST',headers:{Authorization:`Bearer ${env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'niko-project-form','Content-Type':'application/json'},body:JSON.stringify({title:`Project request — ${name}`,body:`## New project request\n\n**Name:** ${name}\n**Email:** ${email}\n\n### Project\n${message}`,labels:['project-request']})});
    if(!r.ok)return out({error:'GitHub could not create the request.'},502,origin);
    const issue=await r.json(); return out({ok:true,issue:issue.html_url},200,origin);
  }
};
function cors(origin){return {'Access-Control-Allow-Origin':origin==='https://nikobutcooler.github.io'?origin:'https://nikobutcooler.github.io','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}}
function out(data,status,origin){return new Response(JSON.stringify(data),{status,headers:{...cors(origin),'Content-Type':'application/json'}})}
