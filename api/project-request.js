export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin');
  const allowed = 'https://nikobutcooler.github.io';
  if (origin && origin !== allowed) return new Response('Forbidden', { status: 403 });

  let data;
  try { data = await context.request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();
  if (!name || !email || !message || name.length > 100 || email.length > 200 || message.length > 5000) {
    return json({ error: 'Please provide valid project details.' }, 400);
  }

  const token = context.env.GITHUB_TOKEN;
  if (!token) return json({ error: 'Backend is not configured.' }, 500);

  const body = `## New project request\n\n**Name:** ${name}\n**Email:** ${email}\n\n### Project\n${message}\n\n_Submitted from nikobutcooler.github.io_`;
  const response = await fetch('https://api.github.com/repos/nikobutcooler/nikobutcooler.github.io/issues', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'niko-project-form',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: `Project request — ${name}`, body, labels: ['project-request'] })
  });
  if (!response.ok) return json({ error: 'Could not create project request.' }, 502);
  const issue = await response.json();
  return json({ ok: true, issue: issue.html_url });
}
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://nikobutcooler.github.io' } }); }
