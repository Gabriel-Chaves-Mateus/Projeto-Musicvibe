# Atividade 15 — testes da Parte A. Requer API em localhost:3000, arquivos em $F (teste.wav, capa.jpg) e DB_PASSWORD no ambiente.
# Contas: ADMIN = admin, A = ana, B = bruno, C = carla. Rode a partir da pasta be/ (para o setAdmin).
F=/tmp/t11; A=localhost:3000/api; H="Authorization: Bearer"; M="mysql -uroot -px musicvibe_db -N -e"
J='Content-Type: application/json'; BE=/home/claude/be
reg(){ curl -s -o /dev/null -XPOST $A/register -H "$J" -d "{\"username\":\"$1\",\"email\":\"$1@t.com\",\"password\":\"123456\",\"confirmPassword\":\"123456\",\"fullName\":\"$2\"}"; }
tok(){ curl -s -XPOST $A/login -H "$J" -d "{\"email\":\"$1@t.com\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
c(){ curl -s -o /dev/null -w "%{http_code}" "$@"; }
b(){ python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
up(){ curl -s -o /dev/null -XPOST $A/songs -H "$H $1" -F title="$2" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"; }
R(){ curl -s -w ' [%{http_code}]' -XPOST "$A/songs/$1/report" -H "$H $2" -H "$J" -d "{\"reason\":\"$3\"}" | sed -E 's/"success":(true|false),//; s/"errors":\[[^]]*\]//'; }
P(){ curl -s -w ' [%{http_code}]' "$@" | sed -E 's/"success":(true|false),//; s/"errors":\[[^]]*\]//'; }
$M "delete from reports; delete from notifications; delete from playlist_songs; delete from playlists; delete from follows; delete from likes; delete from comments; delete from songs; delete from users; alter table users auto_increment=1; alter table songs auto_increment=1"
reg admin "Admin Geral"; reg ana "Ana Souza"; reg bruno "Bruno Lima"; reg carla "Carla Dias"
TAD0=$(tok admin); TA=$(tok ana); TB=$(tok bruno); TC=$(tok carla)
up $TA "Forro da Ana"; up $TB "Samba de Bruno"; up $TB "Rock 100%"
SA=$($M "select id from songs where title like 'Forro%'"); SB=$($M "select id from songs where title like 'Samba%'"); SR=$($M "select id from songs where title like 'Rock%'")
IDA=$($M "select id from users where username='ana'"); IDB=$($M "select id from users where username='bruno'"); IDAD=$($M "select id from users where username='admin'")
echo "ids: songs A=$SA B=$SB,$SR | users admin=$IDAD ana=$IDA bruno=$IDB | o token do ADMIN foi emitido ANTES da promoção"
echo "== 0. PROMOVER (scripts/setAdmin.js)"
(cd $BE && node scripts/setAdmin.js admin 2>&1 | grep -v injected; node scripts/setAdmin.js ninguem 2>&1 | grep -v injected)
echo "== 1. SEM TOKEN (401) E USUÁRIO COMUM (403): sete rotas + rota inexistente"
for r in "GET /admin/dashboard" "GET /admin/reports" "PATCH /admin/reports/1/review" "GET /admin/users" "PATCH /admin/users/$IDB/block" "GET /admin/songs" "DELETE /admin/songs/$SB" "GET /admin/rota-inexistente"; do set -- $r
  printf "%-34s sem token -> %s | token comum (ana) -> %s\n" "$1 $2" "$(c -X$1 $A$2)" "$(c -X$1 $A$2 -H "$H $TA" -H "$J" -d '{"isBlocked":true}')"; done
echo "== 2. DASHBOARD (token do ADMIN emitido antes da promoção)"
R $SB $TA spam >/dev/null; R $SB $TC harassment >/dev/null; R $SA $TB copyright >/dev/null
curl -s $A/admin/dashboard -H "$H $TAD0" | b "(d['data'])"
echo "banco: users=$($M "select count(*) from users") bloqueados=$($M "select count(*) from users where is_blocked=1") songs=$($M "select count(*) from songs") comments=$($M "select count(*) from comments") likes=$($M "select count(*) from likes") pendentes=$($M "select count(*) from reports where status='pending'") revisadas=$($M "select count(*) from reports where status='reviewed'")"
echo "== 3. DENÚNCIAS"
echo "lista padrão (pendentes, mais nova primeiro): $(curl -s $A/admin/reports -H "$H $TAD0" | b "[(r['id'],r['status'],r['Reporter']['username'],r['song']['title'],r['song']['author']['username']) for r in d['data']['reports']]")"
echo "chaves do Reporter: $(curl -s $A/admin/reports -H "$H $TAD0" | b "sorted(d['data']['reports'][0]['Reporter'].keys())") | do autor: $(curl -s $A/admin/reports -H "$H $TAD0" | b "sorted(d['data']['reports'][0]['song']['author'].keys())")"
echo "?status=all      -> $(curl -s "$A/admin/reports?status=all" -H "$H $TAD0" | b "d['data']['total']") denúncias"
echo "?status=reviewed -> $(curl -s "$A/admin/reports?status=reviewed" -H "$H $TAD0" | b "d['data']['total']") denúncias"
echo "?status=xyz      -> $(c "$A/admin/reports?status=xyz" -H "$H $TAD0")"
echo "?limit=1&page=2  -> $(curl -s "$A/admin/reports?limit=1&page=2&status=all" -H "$H $TAD0" | b "([r['id'] for r in d['data']['reports']],'page',d['data']['page'],'hasMore',d['data']['hasMore'])")"
echo "== 4. REVISAR"
RID=$($M "select id from reports order by id limit 1")
echo "revisar $RID       -> $(P -XPATCH $A/admin/reports/$RID/review -H "$H $TAD0")"
echo "repetir            -> $(P -XPATCH $A/admin/reports/$RID/review -H "$H $TAD0")"
echo "99999 -> $(c -XPATCH $A/admin/reports/99999/review -H "$H $TAD0") | abc -> $(c -XPATCH $A/admin/reports/abc/review -H "$H $TAD0") | token comum -> $(c -XPATCH $A/admin/reports/$RID/review -H "$H $TA")"
echo "Dashboard acompanha: $(curl -s $A/admin/dashboard -H "$H $TAD0" | b "('pendingReports',d['data']['pendingReports'],'reviewedReports',d['data']['reviewedReports'])") | lista padrão agora: $(curl -s $A/admin/reports -H "$H $TAD0" | b "d['data']['total']") pendentes"
echo "== 5. USUÁRIOS"
echo "lista: $(curl -s $A/admin/users -H "$H $TAD0" | b "(d['data']['total'],sorted(d['data']['users'][0].keys()))")"
echo "busca 'bru'      -> $(curl -s "$A/admin/users?search=bru" -H "$H $TAD0" | b "[u['username'] for u in d['data']['users']]")"
echo "busca por e-mail 'carla@' -> $(curl -s "$A/admin/users?search=carla@" -H "$H $TAD0" | b "[u['username'] for u in d['data']['users']]")"
echo "busca '%%'       -> $(curl -s "$A/admin/users?search=%25%25" -H "$H $TAD0" | b "d['data']['users']")"
echo "?search=a&search=b -> $(c "$A/admin/users?search=a&search=b" -H "$H $TAD0") (sem erro)"
echo "== 6. BLOQUEAR"
echo "bloquear B       -> $(P -XPATCH $A/admin/users/$IDB/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}')"
echo "repetir          -> $(P -XPATCH $A/admin/users/$IDB/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}')"
echo "token antigo de B (GET /my-songs) -> $(P $A/my-songs -H "$H $TB")"
echo "login de B, senha certa  -> $(P -XPOST $A/login -H "$J" -d '{"email":"bruno@t.com","password":"123456"}')"
echo "login de B, senha errada -> $(P -XPOST $A/login -H "$J" -d '{"email":"bruno@t.com","password":"errada1"}')"
echo "perfil público de B      -> $(c $A/profile/bruno)"
echo "desbloquear B    -> $(P -XPATCH $A/admin/users/$IDB/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":false}')"
echo "mesmo token de B volta   -> $(c $A/my-songs -H "$H $TB")"
echo "erros: {} -> $(c -XPATCH $A/admin/users/$IDB/block -H "$H $TAD0" -H "$J" -d '{}') | \"true\" texto -> $(c -XPATCH $A/admin/users/$IDB/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":"true"}') | a si mesmo -> $(P -XPATCH $A/admin/users/$IDAD/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}')"
(cd $BE && node scripts/setAdmin.js carla 2>&1 | grep -v injected)
echo "outro administrador (carla) -> $(P -XPATCH $A/admin/users/$($M "select id from users where username='carla'")/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}')"
(cd $BE && node scripts/setAdmin.js carla off 2>&1 | grep -v injected)
echo "99999 -> $(c -XPATCH $A/admin/users/99999/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}') | abc -> $(c -XPATCH $A/admin/users/abc/block -H "$H $TAD0" -H "$J" -d '{"isBlocked":true}')"
echo "== 7. REBAIXADO"
(cd $BE && node scripts/setAdmin.js admin off 2>&1 | grep -v injected)
echo "mesmo token do ADMIN -> GET /admin/dashboard = $(c $A/admin/dashboard -H "$H $TAD0")"
(cd $BE && node scripts/setAdmin.js admin 2>&1 | grep -v injected)
echo "promovido de novo    -> $(c $A/admin/dashboard -H "$H $TAD0")"
echo "== 8. ITENS"
c -XPOST $A/songs/$SB/toggle-like -H "$H $TA" >/dev/null; c -XPOST $A/songs/$SB/comments -H "$H $TC" -H "$J" -d '{"content":"top"}' >/dev/null
AUD=$($M "select audio from songs where id=$SB"); COV=$($M "select cover from songs where id=$SB")
echo "lista: $(curl -s $A/admin/songs -H "$H $TAD0" | b "[(s['title'],s['author']['username'],s['pendingReportsCount']) for s in d['data']['songs']]")"
echo "banco (pendentes por item): $($M "select song_id,count(*) from reports where status='pending' group by song_id" | tr '\t\n' ': ')"
echo "busca 'samba' -> $(curl -s "$A/admin/songs?search=samba" -H "$H $TAD0" | b "[s['title'] for s in d['data']['songs']]") | busca "%%" -> $(curl -s "$A/admin/songs?search=%25%25" -H "$H $TAD0" | b "d['data']['songs']")"
echo "antes : songsCount de B = $($M "select songs_count from users where id=$IDB") | reports=$($M "select count(*) from reports where song_id=$SB") notifications=$($M "select count(*) from notifications where song_id=$SB") likes=$($M "select count(*) from likes where song_id=$SB") | arquivo no disco: $(ls $BE/public/uploads/songs/audio/$AUD >/dev/null 2>&1 && echo sim || echo não)"
echo "rota comum DELETE /songs/$SB com token do ADMIN -> $(P -XDELETE $A/songs/$SB -H "$H $TAD0")"
echo "rota do painel DELETE /admin/songs/$SB          -> $(P -XDELETE $A/admin/songs/$SB -H "$H $TAD0")"
echo "depois: songsCount de B = $($M "select songs_count from users where id=$IDB") | reports=$($M "select count(*) from reports where song_id=$SB") notifications=$($M "select count(*) from notifications where song_id=$SB") likes=$($M "select count(*) from likes where song_id=$SB") | arquivo no disco: $(ls $BE/public/uploads/songs/audio/$AUD >/dev/null 2>&1 && echo sim || echo não)"
echo "repetir -> $(c -XDELETE $A/admin/songs/$SB -H "$H $TAD0") | abc -> $(c -XDELETE $A/admin/songs/abc -H "$H $TAD0")"
echo "== 9. REGRESSÃO"
echo "login: $(c -XPOST $A/login -H "$J" -d '{"email":"ana@t.com","password":"123456"}') | perfil: $(c $A/profile/ana) | feed: $(c $A/feed -H "$H $TA") | upload: $(up $TA "Outra da Ana"; echo ok)"
echo "curtir: $(c -XPOST $A/songs/$SA/toggle-like -H "$H $TC") | comentar: $(c -XPOST $A/songs/$SA/comments -H "$H $TC" -H "$J" -d '{"content":"ok"}') | seguir: $(c -XPOST $A/users/$IDA/toggle-follow -H "$H $TC")"
echo "notificações da ana: $(curl -s $A/notifications/unread-count -H "$H $TA" | b "d['data']['unreadCount']") | denunciar: $(c -XPOST $A/songs/$SA/report -H "$H $TC" -H "$J" -d '{"reason":"other"}')"
echo "busca: $(c "$A/search?q=forro") | q=%25%25: $(curl -s "$A/search?q=%25%25" | b "(len(d['data']['songs']),len(d['data']['users']))") (nada casa)"
echo "token lixo -> $(c $A/feed -H "$H lixo")"
