const [,, token, field, value] = process.argv;
const fd = new FormData();
fd.append('title', '     ');
fd.append('audio', new Blob([new Uint8Array(100)], { type: 'audio/wav' }), 'a.wav');
fd.append('cover', new Blob([new Uint8Array(100)], { type: 'image/jpeg' }), 'c.jpg');
const r = await fetch('http://localhost:3000/api/songs', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
console.log('título só com espaços ->', r.status, (await r.json()).message);
