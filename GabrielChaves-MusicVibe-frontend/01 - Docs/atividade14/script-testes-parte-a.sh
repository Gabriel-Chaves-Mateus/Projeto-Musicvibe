# Atividade 14 — testes da Parte A. Requer API em localhost:3000 e arquivos em $F (teste.wav, capa.jpg).
# Contas: A = ana, B = bruno (dono dos itens), C = carla.
F=/tmp/t11; A=localhost:3000/api; H="Authorization: Bearer"; M="mysql -uroot -px musicvibe_db -N -e"
J='Content-Type: application/json'
reg(){ curl -s -o /dev/null -XPOST $A/register -H "$J" -d "{\"username\":\"$1\",\"email\":\"$1@t.com\",\"password\":\"123456\",\"confirmPassword\":\"123456\",\"fullName\":\"$2\"}"; }
tok(){ curl -s -XPOST $A/login -H "$J" -d "{\"email\":\"$1@t.com\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
c(){ curl -s -o /dev/null -w "%{http_code}" "$@"; }
b(){ python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
up(){ curl -s -o /dev/null -XPOST $A/songs -H "$H $1" -F title="$2" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"; }
$M "delete from reports; delete from notifications; delete from playlist_songs; delete from playlists; delete from follows; delete from likes; delete from comments; delete from songs; delete from users; alter table users auto_increment=1; alter table songs auto_increment=1"
reg ana "Ana Souza"; reg bruno "Bruno Lima"; reg carla "Carla Dias"
TA=$(tok ana); TB=$(tok bruno); TC=$(tok carla)
up $TB "Samba de Bruno"; up $TB "Rock 100%"; up $TA "Forro da Ana"
S1=$($M "select id from songs where title='Samba de Bruno'"); S2=$($M "select id from songs where title like 'Rock%'"); S3=$($M "select id from songs where title like 'Forro%'")
echo "ids: songs $S1,$S2,$S3 | contas A=ana B=bruno C=carla"
unread(){ curl -s $A/notifications/unread-count -H "$H $1" | b "d['data']['unreadCount']"; }
echo "== 1. SEM TOKEN (quatro rotas)"
echo "GET   /notifications              -> $(c $A/notifications)"
echo "GET   /notifications/unread-count -> $(c $A/notifications/unread-count)"
echo "PATCH /notifications/1/read       -> $(c -XPATCH $A/notifications/1/read)"
echo "POST  /songs/$S1/report           -> $(c -XPOST $A/songs/$S1/report -H "$J" -d '{"reason":"spam"}')"
echo "== 2. CURTIR"
echo "A curte item de B  -> $(c -XPOST $A/songs/$S1/toggle-like -H "$H $TA")"
echo "B: não lidas = $(unread $TB)"
curl -s $A/notifications -H "$H $TB" | b "[(n['type'],n['isRead'],n['Actor']['username'],sorted(n['Actor'].keys()),n['song']['title']) for n in d['data']['notifications']]"
echo "A curte o PRÓPRIO item ($S3) -> $(c -XPOST $A/songs/$S3/toggle-like -H "$H $TA") | A: não lidas = $(unread $TA)"
echo "A descurte item de B -> $(c -XPOST $A/songs/$S1/toggle-like -H "$H $TA") | B: não lidas = $(unread $TB)"
c -XPOST $A/songs/$S1/toggle-like -H "$H $TA" >/dev/null
echo "A curte de novo      -> B: não lidas = $(unread $TB), linhas like no banco = $($M "select count(*) from notifications where type='like' and song_id=$S1")"
echo "== 3. COMENTAR"
echo "C comenta no item de B  -> $(c -XPOST $A/songs/$S1/comments -H "$H $TC" -H "$J" -d '{"content":"Muito bom!"}') | B: não lidas = $(unread $TB)"
echo "B comenta no próprio    -> $(c -XPOST $A/songs/$S1/comments -H "$H $TB" -H "$J" -d '{"content":"Obrigado!"}') | B: não lidas = $(unread $TB)"
echo "== 4. SEGUIR"
BID=$($M "select id from users where username='bruno'")
echo "A segue B -> $(c -XPOST $A/users/$BID/toggle-follow -H "$H $TA") | B: não lidas = $(unread $TB)"
curl -s "$A/notifications" -H "$H $TB" | b "[(n['type'],n['songId'],n['Actor']['username']) for n in d['data']['notifications'] if n['type']=='follow']"
echo "A deixa de seguir -> $(c -XPOST $A/users/$BID/toggle-follow -H "$H $TA") | follow no banco = $($M "select count(*) from notifications where type='follow'")"
echo "A segue de novo   -> $(c -XPOST $A/users/$BID/toggle-follow -H "$H $TA") | follow no banco = $($M "select count(*) from notifications where type='follow'")"
echo "== 5. LISTA"
echo "ordem (mais nova primeiro): $(curl -s $A/notifications -H "$H $TB" | b "[n['type'] for n in d['data']['notifications']]")"
echo "?limit=1&page=2 -> $(curl -s "$A/notifications?limit=1&page=2" -H "$H $TB" | b "([n['type'] for n in d['data']['notifications']],'page',d['data']['page'],'hasMore',d['data']['hasMore'])")"
echo "página além do fim -> $(curl -s "$A/notifications?limit=1&page=99" -H "$H $TB" | b "d['data']['notifications']")"
echo "?page=abc&limit=-5 -> $(curl -s "$A/notifications?page=abc&limit=-5" -H "$H $TB" | b "('page',d['data']['page'],'limit',d['data']['limit'],len(d['data']['notifications']))")"
echo "C vê só as dela: $(curl -s $A/notifications -H "$H $TC" | b "d['data']['total']") notificações"
echo "== 6. MARCAR COMO LIDA"
NID=$(curl -s $A/notifications -H "$H $TB" | b "d['data']['notifications'][0]['id']")
echo "antes: B não lidas = $(unread $TB)"
echo "outra conta (C)   -> $(c -XPATCH $A/notifications/$NID/read -H "$H $TC")"
echo "id inexistente    -> $(c -XPATCH $A/notifications/99999/read -H "$H $TB")"
echo "id 'abc'          -> $(c -XPATCH $A/notifications/abc/read -H "$H $TB")"
echo "a dona (B)        -> $(curl -s -w ' [%{http_code}]' -XPATCH $A/notifications/$NID/read -H "$H $TB" | sed -E 's/.*"data":(\{[^}]*\}).*\[([0-9]+)\]/\1 [\2]/')"
echo "repetir (B)       -> $(curl -s -w ' [%{http_code}]' -XPATCH $A/notifications/$NID/read -H "$H $TB" | sed -E 's/.*"data":(\{[^}]*\}).*\[([0-9]+)\]/\1 [\2]/')"
echo "unread-count agora = $(unread $TB) | lista: lidas = $(curl -s $A/notifications -H "$H $TB" | b "[n['isRead'] for n in d['data']['notifications']]")"
echo "== 7. DENÚNCIA"
R(){ curl -s -w ' [%{http_code}]' -XPOST "$A/songs/$1/report" -H "$H $2" -H "$J" -d "$3" | sed -E 's/"success":(true|false),//; s/"errors":\[[^]]*\]//'; }
echo "C denuncia (spam)         -> $(R $S1 $TC '{"reason":"spam"}')"
echo "C repete                  -> $(R $S1 $TC '{"reason":"spam"}')"
echo "A denuncia o mesmo item   -> $(R $S1 $TA '{"reason":"harassment"}')"
echo "sem reason                -> $(c -XPOST $A/songs/$S2/report -H "$H $TC" -H "$J" -d '{}')"
echo "reason fora da lista      -> $(c -XPOST $A/songs/$S2/report -H "$H $TC" -H "$J" -d '{"reason":"xingamento"}')"
echo "rótulo em vez da chave    -> $(c -XPOST $A/songs/$S2/report -H "$H $TC" -H "$J" -d '{"reason":"Spam ou golpes"}')"
echo "id 'abc'                  -> $(c -XPOST $A/songs/abc/report -H "$H $TC" -H "$J" -d '{"reason":"spam"}')"
echo "id 99999                  -> $(c -XPOST $A/songs/99999/report -H "$H $TC" -H "$J" -d '{"reason":"spam"}')"
echo "dono denuncia o próprio   -> $(R $S1 $TB '{"reason":"spam"}')"
echo "sem token                 -> $(c -XPOST $A/songs/$S1/report -H "$J" -d '{"reason":"spam"}')"
echo "dono não ganhou aviso de denúncia: tipos no banco = $($M "select distinct type from notifications where user_id=$BID" | tr '\n' ' ')"
echo "dois cliques simultâneos (C denuncia $S2): $(for i in 1 2; do c -XPOST $A/songs/$S2/report -H "$H $TC" -H "$J" -d '{"reason":"copyright"}' & done; wait) | linhas = $($M "select count(*) from reports where song_id=$S2")"
echo "== 8. BANCO"
CID=$($M "select id from users where username='carla'")
echo "mysql> INSERT INTO reports (user_id,song_id,reason,created_at,updated_at) VALUES ($CID,$S1,'spam',NOW(),NOW());"
$M "INSERT INTO reports (user_id,song_id,reason,created_at,updated_at) VALUES ($CID,$S1,'spam',NOW(),NOW())" 2>&1 | sed 's/^/   /'
echo "mysql> INSERT INTO reports (user_id,song_id,reason,created_at,updated_at) VALUES ($CID,$S3,'xingamento',NOW(),NOW());"
$M "INSERT INTO reports (user_id,song_id,reason,created_at,updated_at) VALUES ($CID,$S3,'xingamento',NOW(),NOW())" 2>&1 | sed 's/^/   /'
echo "== 9. EXCLUIR ITEM COM DENÚNCIAS E CURTIDAS/COMENTÁRIOS"
up $TB "Item para excluir"; SX=$($M "select id from songs where title='Item para excluir'")
c -XPOST $A/songs/$SX/toggle-like -H "$H $TA" >/dev/null; c -XPOST $A/songs/$SX/toggle-like -H "$H $TC" >/dev/null
c -XPOST $A/songs/$SX/comments -H "$H $TA" -H "$J" -d '{"content":"a"}' >/dev/null; c -XPOST $A/songs/$SX/comments -H "$H $TC" -H "$J" -d '{"content":"c"}' >/dev/null
R $SX $TA '{"reason":"other"}' >/dev/null; R $SX $TC '{"reason":"copyright"}' >/dev/null
echo "antes : reports=$($M "select count(*) from reports where song_id=$SX") notifications=$($M "select count(*) from notifications where song_id=$SX")"
echo "DELETE /songs/$SX -> $(c -XDELETE $A/songs/$SX -H "$H $TB")"
echo "depois: reports=$($M "select count(*) from reports where song_id=$SX") notifications=$($M "select count(*) from notifications where song_id=$SX")"
echo "avisos órfãos (song_id NULL e type<>'follow'): $($M "select count(*) from notifications where song_id is null and type<>'follow'")"
echo "== 10. LOGOUT COM CORPO 'null' (CORS antes do express.json)"
curl -s -i -XPOST $A/logout -H "Origin: http://localhost:5173" -H "$J" -d "null" | grep -iE "^HTTP|access-control-allow-origin"
echo "== 11. REGRESSÃO"
echo "curtir 201/200 : $(c -XPOST $A/songs/$S2/toggle-like -H "$H $TA") (liked) / $(c -XPOST $A/songs/$S2/toggle-like -H "$H $TA") (unliked)"
echo "comentar       : $(c -XPOST $A/songs/$S2/comments -H "$H $TA" -H "$J" -d '{"content":"ok"}')"
echo "seguir         : $(c -XPOST $A/users/$CID/toggle-follow -H "$H $TA")"
echo "listas         : followers $(c $A/users/$BID/followers) following $(c $A/users/$BID/following) | liked $(c $A/liked-songs -H "$H $TA")"
echo "coleções       : $(c -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"Teste"}') / $(c $A/my-playlists -H "$H $TA")"
echo "busca          : $(c "$A/search?q=samba")"
echo "feed: $(c $A/feed -H "$H $TA") | seguindo: $(c $A/following-songs -H "$H $TA")"
echo "upload/edição  : $(c -XPUT $A/songs/$S1 -H "$H $TB" -F title="Samba de Bruno")"
echo "GET /users/abc/followers -> $(c $A/users/abc/followers)"
