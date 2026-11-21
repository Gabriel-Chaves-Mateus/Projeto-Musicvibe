# Script de testes da Parte A (Atividade 11). Requer API em localhost:3000 e arquivos de teste em $F.
F=/tmp/t11; A=localhost:3000/api; H="Authorization: Bearer"
M="mysql -uroot -px musicvibe_db -N -e"
reg(){ curl -s -o /dev/null -XPOST $A/register -H 'Content-Type: application/json' -d "{\"username\":\"$1\",\"email\":\"$1@t.com\",\"password\":\"123456\",\"confirmPassword\":\"123456\",\"fullName\":\"$2\"}"; }
tok(){ curl -s -XPOST $A/login -H 'Content-Type: application/json' -d "{\"email\":\"$1@t.com\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
$M "delete from follows; delete from likes; delete from comments; delete from songs; delete from users; alter table users auto_increment=1"
reg ana "Ana Souza"; reg bruno "Bruno Lima"; reg carla "Carla Dias"
TA=$(tok ana); TB=$(tok bruno); TC=$(tok carla)
IA=$($M "select id from users where username='ana'"); IB=$($M "select id from users where username='bruno'"); IC=$($M "select id from users where username='carla'")
echo "ids: ana=$IA bruno=$IB carla=$IC"
curl -s -o /dev/null -XPOST $A/songs -H "$H $TB" -F title="Música do Bruno" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
curl -s -o /dev/null -XPOST $A/songs -H "$H $TC" -F title="Música da Carla" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
cnt(){ curl -s $A/profile/$1 | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('$1: followersCount',d['followersCount'],'followingCount',d['followingCount'])"; }
echo "== 1. VALIDAÇÕES do toggle-follow"
curl -s -o /dev/null -w "sem token [%{http_code}]\n" -XPOST $A/users/$IB/toggle-follow
curl -s -w " [%{http_code}] id=abc\n" -XPOST $A/users/abc/toggle-follow -H "$H $TA" | sed -E 's/"errors".*\]//'
curl -s -w " [%{http_code}] seguir a si mesmo\n" -XPOST $A/users/$IA/toggle-follow -H "$H $TA" | sed -E 's/"errors".*\]//'
curl -s -w " [%{http_code}] usuário 99999\n" -XPOST $A/users/99999/toggle-follow -H "$H $TA" | sed -E 's/"errors".*\]//'
echo "== 2. SEGUIR / DEIXAR DE SEGUIR"
for t in "A seguir B:$TA:$IB" "A de novo:$TA:$IB" "A de novo:$TA:$IB" "C segue B:$TC:$IB" "B segue A:$TB:$IA"; do
  IFS=: read -r label T ID <<<"$t"; echo -n "$label -> "; curl -s -w " [%{http_code}]\n" -XPOST $A/users/$ID/toggle-follow -H "$H $T" | sed -E 's/.*"data"://'; done
echo "== 3. CONTADORES"; cnt bruno; cnt ana; cnt carla
echo "== 4. follow-status e isFollowing"
echo "follow-status sem token: $(curl -s -o /dev/null -w '%{http_code}' $A/users/$IB/follow-status)"
echo "follow-status A->B: $(curl -s $A/users/$IB/follow-status -H "$H $TA" | sed -E 's/.*"data"://')"
echo "follow-status C->A: $(curl -s $A/users/$IA/follow-status -H "$H $TC" | sed -E 's/.*"data"://')"
pf(){ curl -s $A/profile/$1 ${2:+-H "$H $2"} | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('$3','isFollowing',d['isFollowing'],'isOwner',d['isOwner'])"; }
pf bruno "" "visitante vendo bruno:"; pf bruno $TA "A vendo B:"; pf ana $TC "C vendo A:"; pf bruno $TB "B vendo o próprio perfil:"
echo "== 5. LISTAS"
curl -s $A/users/$IB/followers | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('followers de B:',[p['username'] for p in d],'| chaves:',sorted(d[0].keys()))"
curl -s $A/users/$IA/following | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('following de A:',[p['username'] for p in d])"
curl -s -w " [%{http_code}] followers de usuário inexistente\n" $A/users/99999/followers
echo "== 6. FEED FILTRADO"
curl -s -o /dev/null -w "sem token [%{http_code}]\n" $A/following-songs
fs(){ python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('$1',[(s['title'],s['author']['username']) for s in d['songs']],'page',d['page'],'hasMore',d['hasMore'],'total',d['total'])"; }
curl -s $A/following-songs -H "$H $TA" | fs "A (segue B):"
curl -s "$A/following-songs?page=2&limit=1" -H "$H $TA" | fs "A page=2&limit=1:"
curl -s $A/following-songs -H "$H $TB" | fs "B (segue A, A não tem músicas):"
curl -s -XPOST $A/register -H 'Content-Type: application/json' -d '{"username":"davi","email":"davi@t.com","password":"123456","confirmPassword":"123456","fullName":"Davi Rocha"}' -o /dev/null; TD=$(tok davi)
curl -s $A/following-songs -H "$H $TD" | fs "D (não segue ninguém):"
echo "== 7. UNIQUE (insert repetido)"
$M "insert into follows (follower_id,following_id,created_at,updated_at) values ($IA,$IB,now(),now())" 2>&1 | grep ERROR
echo "== 8. REGRESSÃO"
SID=$($M "select id from songs where user_id=$IB limit 1")
echo "curtir: $(curl -s -o /dev/null -w '%{http_code}' -XPOST $A/songs/$SID/toggle-like -H "$H $TA")  comentar: $(curl -s -o /dev/null -w '%{http_code}' -XPOST $A/songs/$SID/comments -H "$H $TA" -H 'Content-Type: application/json' -d '{"content":"ok"}')  feed geral: $(curl -s -o /dev/null -w '%{http_code}' $A/feed -H "$H $TA")  detalhe: $(curl -s -o /dev/null -w '%{http_code}' $A/songs/$SID)"
NID=$(curl -s -XPOST $A/songs -H "$H $TA" -F title="Temporária" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")
echo "upload: id $NID  editar: $(curl -s -o /dev/null -w '%{http_code}' -XPUT $A/songs/$NID -H "$H $TA" -F title='Temporária 2')  excluir: $(curl -s -o /dev/null -w '%{http_code}' -XDELETE $A/songs/$NID -H "$H $TA")"
echo "== ÍNDICES"; mysql -uroot -px musicvibe_db -e "show index from follows" 2>/dev/null | cut -f1-6
