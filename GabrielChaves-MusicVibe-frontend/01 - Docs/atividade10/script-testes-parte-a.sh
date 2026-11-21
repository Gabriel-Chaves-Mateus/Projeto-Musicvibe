cd /home/claude/be; S=/tmp/claude-0/-home-claude/833ba43f-beac-52e1-b4ea-35b86eb21f7a/scratchpad; A=localhost:3000/api; H="Authorization: Bearer"
M="mysql -uroot -px musicvibe_db -N -e"
tok(){ curl -s -XPOST $A/login -H 'Content-Type: application/json' -d "{\"email\":\"$1\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
TA=$(tok g@t.com); TB=$(tok m@t.com); echo $TA > $S/tokenA; echo $TB > $S/tokenB
ID=$($M "select min(id) from songs where user_id=1"); echo "música de teste: $ID"
$M "delete from likes; delete from comments; update songs set likes_count=0, comments_count=0"
j(){ python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('data') if not isinstance(d.get('data'),dict) else {k:d['data'][k] for k in d['data'] if k in('liked','likesCount','isLiked','commentsCount','content','author','isOwner')} , '|', d.get('message'))"; }
echo "== LIKE"
curl -s -o /dev/null -w "sem token [%{http_code}]\n" -XPOST $A/songs/$ID/toggle-like
curl -s -o /dev/null -w "inexistente [%{http_code}]\n" -XPOST $A/songs/99999/toggle-like -H "$H $TB"
for t in B B B A; do T=$TB; [ $t = A ] && T=$TA; curl -s -w " [%{http_code}] ($t)\n" -XPOST $A/songs/$ID/toggle-like -H "$H $T" | sed -E 's/.*"data"://'; done
echo "== STATUS"
curl -s $A/songs/$ID/like-status | sed -E 's/.*"data"://'; curl -s $A/songs/$ID/like-status -H "$H $TB" | sed -E 's/.*"data"://'
echo "detalhe visitante: $(curl -s $A/songs/$ID | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('isLiked',d['isLiked'],'likesCount',d['likesCount'])")"
echo "detalhe B: $(curl -s $A/songs/$ID -H "$H $TB" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('isLiked',d['isLiked'],'likesCount',d['likesCount'])")"
echo "== UNIQUE (insert manual repetido)"
$M "insert into likes (user_id,song_id,created_at,updated_at) values (2,$ID,now(),now())" 2>&1 | head -n 2
echo "== LIKED-SONGS"
curl -s -o /dev/null -w "sem token [%{http_code}]\n" $A/liked-songs
curl -s $A/liked-songs -H "$H $TB" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print([(s['title'],s['author']['username']) for s in d])"
echo "== COMMENTS"
curl -s -o /dev/null -w "sem token [%{http_code}]\n" -XPOST $A/songs/$ID/comments -H 'Content-Type: application/json' -d '{"content":"oi"}'
curl -s -w " [%{http_code}] só espaços\n" -XPOST $A/songs/$ID/comments -H "$H $TB" -H 'Content-Type: application/json' -d '{"content":"     "}' | sed -E 's/"errors".*\]//'
LONG=$(python3 -c "print('a'*501)"); curl -s -w " [%{http_code}] 501 chars\n" -XPOST $A/songs/$ID/comments -H "$H $TB" -H 'Content-Type: application/json' -d "{\"content\":\"$LONG\"}" | sed -E 's/"errors".*\]//'
curl -s -o /dev/null -w "inexistente [%{http_code}]\n" -XPOST $A/songs/99999/comments -H "$H $TB" -H 'Content-Type: application/json' -d '{"content":"oi"}'
curl -s -w " [%{http_code}] sucesso\n" -XPOST $A/songs/$ID/comments -H "$H $TB" -H 'Content-Type: application/json' -d '{"content":"   Primeiro comentário!   "}' | cut -c1-330
sleep 1; curl -s -o /dev/null -XPOST $A/songs/$ID/comments -H "$H $TA" -H 'Content-Type: application/json' -d '{"content":"Segundo\ncom duas linhas"}'
curl -s -w " [%{http_code}]\n" $A/songs/$ID/comments | python3 -c "import sys,json;raw=sys.stdin.read();body,code=raw.rsplit(' [',1);d=json.loads(body)['data'];print('lista sem token:',[c['content'] for c in d],'['+code.strip())"
echo "detalhe commentsCount: $(curl -s $A/songs/$ID | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['commentsCount'])")"
echo "== EXCLUIR com likes+comments"
NID=$(curl -s -XPOST $A/songs -H "$H $TA" -F title="Com interações" -F "audio=@$S/teste.wav;type=audio/wav" -F "cover=@$S/capa0.jpg;type=image/jpeg" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")
curl -s -o /dev/null -XPOST $A/songs/$NID/toggle-like -H "$H $TB"; curl -s -o /dev/null -XPOST $A/songs/$NID/comments -H "$H $TB" -H 'Content-Type: application/json' -d '{"content":"vai sumir"}'
echo "antes: likes=$($M "select count(*) from likes where song_id=$NID") comments=$($M "select count(*) from comments where song_id=$NID") songs_count=$($M 'select songs_count from users where id=1') arquivos=$(ls public/uploads/songs/audio | wc -l)/$(ls public/uploads/songs/covers | wc -l)"
curl -s -o /dev/null -w "DELETE [%{http_code}]\n" -XDELETE $A/songs/$NID -H "$H $TA"; sleep 1
echo "depois: likes=$($M "select count(*) from likes where song_id=$NID") comments=$($M "select count(*) from comments where song_id=$NID") songs_count=$($M 'select songs_count from users where id=1') arquivos=$(ls public/uploads/songs/audio | wc -l)/$(ls public/uploads/songs/covers | wc -l)"
echo "== PERFIL contadores"; curl -s $A/profile/gabriel | python3 -c "import sys,json;print([(s['title'],s['likesCount'],s['commentsCount']) for s in json.load(sys.stdin)['data']['songs']])"
echo "== TRIM"
cat > /tmp/trim.mjs <<'JS'
const [,, token, field, value] = process.argv;
const fd = new FormData();
fd.append('title', '     ');
fd.append('audio', new Blob([new Uint8Array(100)], { type: 'audio/wav' }), 'a.wav');
fd.append('cover', new Blob([new Uint8Array(100)], { type: 'image/jpeg' }), 'c.jpg');
const r = await fetch('http://localhost:3000/api/songs', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
console.log('título só com espaços ->', r.status, (await r.json()).message);
JS
node /tmp/trim.mjs $TA
curl -s -w " [%{http_code}] fullName só espaços (registro)\n" -XPOST $A/register -H 'Content-Type: application/json' -d '{"username":"  ab  ","email":"x@t.com","password":"123456","confirmPassword":"123456","fullName":"   "}' | sed -E 's/"errors".*\]//'
echo "arquivos finais: $(ls public/uploads/songs/audio | wc -l)/$(ls public/uploads/songs/covers | wc -l)"
