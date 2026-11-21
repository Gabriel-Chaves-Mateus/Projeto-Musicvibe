# Parte A (Atividade 12): paginação depois da correção, transação do cadastro de música e regressão.
# Requer API em localhost:3000 com as contas ana/bruno/carla (criadas pelo script da Atividade 11).
F=/tmp/t11; A=localhost:3000/api; H="Authorization: Bearer"; M="mysql -uroot -px musicvibe_db -N -e"
tok(){ curl -s -XPOST $A/login -H 'Content-Type: application/json' -d "{\"email\":\"$1@t.com\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
TA=$(tok ana); TB=$(tok bruno); TC=$(tok carla)
IA=$($M "select id from users where username='ana'"); IB=$($M "select id from users where username='bruno'"); IC=$($M "select id from users where username='carla'")
$M "delete from follows; delete from likes; delete from comments; update users set followers_count=0, following_count=0; update songs set likes_count=0, comments_count=0"
# A já segue B (para o feed filtrado ter itens na paginação)
$M "insert into follows (follower_id,following_id,created_at,updated_at) values ($IA,$IB,now(),now()); update users set followers_count=1 where id=$IB; update users set following_count=1 where id=$IA"
$M "delete from songs where user_id=$IA; update users set songs_count=0 where id=$IA"
SB=$($M "select id from songs where user_id=$IB limit 1")
show(){ curl -s -w ' [%{http_code}]' "$1" ${2:+-H "$H $2"} | python3 -c "
import sys,json
raw=sys.stdin.read(); body,code=raw.rsplit(' [',1); d=json.loads(body)['data']
print('page',d['page'],'limit',d['limit'],'songs',len(d['songs']),'total',d['total'],'hasMore',d['hasMore'],'['+code)"; }
echo "== PAGINACAO (depois)"
for q in "limit=-3" "limit=100000" "page=-2&limit=2" "limit=abc" "limit=1&page=2"; do echo "GET /feed?$q -> $(show "$A/feed?$q" $TA)"; done
for q in "limit=-3" "limit=100000" "page=-2&limit=2" "limit=1&page=2"; do echo "GET /following-songs?$q -> $(show "$A/following-songs?$q" $TA)"; done
echo "== CRIACAO (transacao)"
echo "songs_count de ana antes: $($M "select songs_count from users where id=$IA")"
echo "POST /songs -> $(curl -s -o /dev/null -w '%{http_code}' -XPOST $A/songs -H "$H $TA" -F title='Nova música' -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg")"
echo "songs_count de ana depois: $($M "select songs_count from users where id=$IA")  (músicas reais: $($M "select count(*) from songs where user_id=$IA"))"
echo "POST /songs sem capa (falha) -> $(curl -s -o /dev/null -w '%{http_code}' -XPOST $A/songs -H "$H $TA" -F title='Sem capa' -F "audio=@$F/teste.wav;type=audio/wav")  songs_count continua: $($M "select songs_count from users where id=$IA")"
echo "== REGRESSAO"
c(){ curl -s -o /dev/null -w "%{http_code}" "$@"; }
echo "seguir: C->B $(curl -s -XPOST $A/users/$IB/toggle-follow -H "$H $TC" | sed -E 's/.*"data"://')  A->C $(curl -s -XPOST $A/users/$IC/toggle-follow -H "$H $TA" | sed -E 's/.*"data"://')"
echo "perfil bruno (visitante / ana): $(curl -s $A/profile/bruno | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('isFollowing',d['isFollowing'],'seguidores',d['followersCount'])") / $(curl -s $A/profile/bruno -H "$H $TA" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('isFollowing',d['isFollowing'],'seguidores',d['followersCount'])")"
echo "followers de bruno: $(curl -s $A/users/$IB/followers | python3 -c "import sys,json;print([p['username'] for p in json.load(sys.stdin)['data']])")  following de ana: $(curl -s $A/users/$IA/following | python3 -c "import sys,json;print([p['username'] for p in json.load(sys.stdin)['data']])")"
echo "feed filtrado de ana: $(curl -s $A/following-songs -H "$H $TA" | python3 -c "import sys,json;print([s['title'] for s in json.load(sys.stdin)['data']['songs']])")"
echo "feed geral: $(curl -s $A/feed -H "$H $TA" | python3 -c "import sys,json;print([s['title'] for s in json.load(sys.stdin)['data']['songs']])")"
echo "curtir: $(curl -s -w ' [%{http_code}]' -XPOST $A/songs/$SB/toggle-like -H "$H $TA" | sed -E 's/.*"data"://')  de novo: $(curl -s -w ' [%{http_code}]' -XPOST $A/songs/$SB/toggle-like -H "$H $TA" | sed -E 's/.*"data"://')  e de novo: $(curl -s -w ' [%{http_code}]' -XPOST $A/songs/$SB/toggle-like -H "$H $TA" | sed -E 's/.*"data"://')"
echo "curtidas de ana: $(curl -s $A/liked-songs -H "$H $TA" | python3 -c "import sys,json;print([s['title'] for s in json.load(sys.stdin)['data']])")"
echo "comentar: $(curl -s -w ' [%{http_code}]' -XPOST $A/songs/$SB/comments -H "$H $TA" -H 'Content-Type: application/json' -d '{"content":"  ótima!  "}' | python3 -c "import sys;r=sys.stdin.read();import json;b,c=r.rsplit(' [',1);d=json.loads(b)['data'];print(repr(d['content']),'['+c)")"
echo "comentários: $(curl -s $A/songs/$SB/comments | python3 -c "import sys,json;print([c['content'] for c in json.load(sys.stdin)['data']])")  commentsCount no detalhe: $(curl -s $A/songs/$SB | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['commentsCount'])")"
echo "meus itens (ana): $(curl -s $A/my-songs -H "$H $TA" | python3 -c "import sys,json;print([s['title'] for s in json.load(sys.stdin)['data']])")"
echo "sem token: feed $(c $A/feed) following-songs $(c $A/following-songs) toggle-like $(c -XPOST $A/songs/$SB/toggle-like) toggle-follow $(c -XPOST $A/users/$IB/toggle-follow)"
echo "== ID INVALIDO (Bloco 2.5)"
for u in "songs/abc" "songs/-1" "songs/abc/toggle-like:POST" "users/abc/toggle-follow:POST" "users/abc/followers" "songs/abc/comments" "songs/abc/stream" "songs/99999" "users/99999/followers"; do p=${u%%:*}; m=GET; [[ $u == *:POST ]] && m=POST; echo "$m /$p -> $(curl -s -o /dev/null -w '%{http_code}' -X$m $A/$p -H "$H $TA")"; done
