# Atividade 13 — testes da Parte A. Requer API em localhost:3000 e arquivos em $F (teste.wav, capa.jpg).
F=/tmp/t11; A=localhost:3000/api; H="Authorization: Bearer"; M="mysql -uroot -px musicvibe_db -N -e"
J='Content-Type: application/json'
reg(){ curl -s -o /dev/null -XPOST $A/register -H "$J" -d "{\"username\":\"$1\",\"email\":\"$1@t.com\",\"password\":\"123456\",\"confirmPassword\":\"123456\",\"fullName\":\"$2\"}"; }
tok(){ curl -s -XPOST $A/login -H "$J" -d "{\"email\":\"$1@t.com\",\"password\":\"123456\"}" | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])"; }
c(){ curl -s -o /dev/null -w "%{http_code}" "$@"; }
b(){ python3 -c "import sys,json;d=json.load(sys.stdin);print($1)"; }
$M "delete from playlist_songs; delete from playlists; delete from follows; delete from likes; delete from comments; delete from songs; delete from users; alter table users auto_increment=1; alter table songs auto_increment=1"
reg ana "Ana Souza"; reg bruno "Bruno Lima"
TA=$(tok ana); TB=$(tok bruno)
curl -s -o /dev/null -XPOST $A/songs -H "$H $TB" -F title="Samba de Bruno" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
curl -s -o /dev/null -XPOST $A/songs -H "$H $TB" -F title="Rock 100%" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
S1=$($M "select id from songs where title='Samba de Bruno'"); S2=$($M "select id from songs where title like 'Rock%'")
echo "ids: songs $S1,$S2"
echo "== 1. CRIAR"
echo "sem token                     -> $(c -XPOST $A/my-playlists -H "$J" -d '{"title":"Treino"}')"
echo "título 'ab'                   -> $(c -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"ab"}')"
echo "só espaços                    -> $(c -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"     "}')"
echo "isPublic: \"sim\"               -> $(c -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"Treino","isPublic":"sim"}')"
echo "sucesso (sem isPublic, título com espaços) -> $(curl -s -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"   Treino   "}' | b "(lambda x:(x['data']['title'].__repr__(),'isPublic',x['data']['isPublic']))(d)")"
echo "sucesso com isPublic: true    -> $(curl -s -w ' [%{http_code}]' -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"Viagem","description":"Para a estrada","isPublic":true}' | sed -E 's/.*"isPublic":(true|false).*\[([0-9]+)\]/isPublic \1 [\2]/')"
echo "== 2. LISTAR (duas criadas em seguida, mais nova primeiro)"
curl -s -o /dev/null -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"Primeira rapida"}'; curl -s -o /dev/null -XPOST $A/my-playlists -H "$H $TA" -H "$J" -d '{"title":"Segunda rapida"}'
curl -s $A/my-playlists -H "$H $TA" | b "[p['title'] for p in d['data']]"
echo "bruno vê as dele: $(curl -s $A/my-playlists -H "$H $TB" | b "len(d['data'])") playlists"
PA=$($M "select id from playlists where title='Treino'"); PV=$($M "select id from playlists where title='Viagem'")
curl -s -XPOST $A/my-playlists -H "$H $TB" -H "$J" -d '{"title":"Do Bruno"}' >/dev/null; PB=$($M "select id from playlists where title='Do Bruno'")
echo "== 3. ADICIONAR"
add(){ curl -s -w ' [%{http_code}]' -XPOST $A/playlists/$1/songs -H "$H $2" -H "$J" -d "$3" | sed -E 's/.*"data"://; s/"message".*//'; }
echo "primeira vez     -> $(add $PA $TA "{\"songId\":$S1}")"
echo "repetir          -> $(add $PA $TA "{\"songId\":$S1}")"
echo "música 99999     -> $(c -XPOST $A/playlists/$PA/songs -H "$H $TA" -H "$J" -d '{"songId":99999}')"
echo "corpo sem id     -> $(c -XPOST $A/playlists/$PA/songs -H "$H $TA" -H "$J" -d '{}')"
echo "songId 'abc'     -> $(c -XPOST $A/playlists/$PA/songs -H "$H $TA" -H "$J" -d '{"songId":"abc"}')"
echo "playlist alheia  -> $(c -XPOST $A/playlists/$PB/songs -H "$H $TA" -H "$J" -d "{\"songId\":$S1}")"
echo "playlist 99999   -> $(c -XPOST $A/playlists/99999/songs -H "$H $TA" -H "$J" -d "{\"songId\":$S1}")"
echo "id 'abc' na URL  -> $(c -XPOST $A/playlists/abc/songs -H "$H $TA" -H "$J" -d "{\"songId\":$S1}")"
add $PA $TA "{\"songId\":$S2}" >/dev/null
echo "== 4. REMOVER"
echo "remover          -> $(curl -s -w ' [%{http_code}]' -XDELETE $A/playlists/$PA/songs/$S2 -H "$H $TA" | sed -E 's/.*"data"://; s/"message".*//')"
echo "repetir          -> $(curl -s -w ' [%{http_code}]' -XDELETE $A/playlists/$PA/songs/$S2 -H "$H $TA" | sed -E 's/"errors":\[[^]]*\]\}//')"
echo "playlist alheia  -> $(c -XDELETE $A/playlists/$PB/songs/$S1 -H "$H $TA")"
echo "== 5. LER"
add $PV $TA "{\"songId\":$S1}" >/dev/null
rd(){ curl -s -w ' [%{http_code}]' $A/playlists/$1 ${2:+-H "$H $2"} | python3 -c "
import sys,json
raw=sys.stdin.read(); body,code=raw.rsplit(' [',1); d=json.loads(body)
x=d.get('data')
print(('isOwner',x['isOwner'],'dona',x['author']['username'],'itens',[ (s['title'],s['author']['username']) for s in x['songs']],'password' in body) if x else d['message'],'['+code)"; }
echo "pública, visitante  -> $(rd $PV)"
echo "privada, visitante  -> $(rd $PA)"
echo "privada, outra conta-> $(rd $PA $TB)"
echo "privada, dona       -> $(rd $PA $TA)"
echo "99999               -> $(rd 99999)"
echo "abc                 -> $(rd abc)"
echo "== 6. STATUS"
echo "sem token           -> $(c $A/songs/$S1/playlists-status)"
echo "ana, música $S1     -> $(curl -s $A/songs/$S1/playlists-status -H "$H $TA" | b "[(p['title'],p['hasSong']) for p in d['data']]")"
echo "ana, música $S2     -> $(curl -s $A/songs/$S2/playlists-status -H "$H $TA" | b "[(p['title'],p['hasSong']) for p in d['data']]")"
echo "música 99999        -> $(c $A/songs/99999/playlists-status -H "$H $TA")"
echo "bruno vê as dele    -> $(curl -s $A/songs/$S1/playlists-status -H "$H $TB" | b "[(p['title'],p['hasSong']) for p in d['data']]")"
echo "== 7. EXCLUIR A PLAYLIST"
echo "alheia              -> $(c -XDELETE $A/playlists/$PV -H "$H $TB")"
echo "dona                -> $(c -XDELETE $A/playlists/$PV -H "$H $TA")"
echo "de novo             -> $(c -XDELETE $A/playlists/$PV -H "$H $TA")"
echo "linhas da junção da playlist $PV: $($M "select count(*) from playlist_songs where playlist_id=$PV")  |  música $S1 ainda existe: $($M "select count(*) from songs where id=$S1")"
echo "== 8. EXCLUIR UMA MÚSICA QUE ESTÁ EM PLAYLISTS DE DUAS PESSOAS"
add $PB $TB "{\"songId\":$S1}" >/dev/null
echo "antes : ana/Treino=$($M "select songs_count from playlists where id=$PA")  bruno/Do Bruno=$($M "select songs_count from playlists where id=$PB")"
echo "DELETE /songs/$S1 -> $(c -XDELETE $A/songs/$S1 -H "$H $TB")"
echo "depois: ana/Treino=$($M "select songs_count from playlists where id=$PA")  bruno/Do Bruno=$($M "select songs_count from playlists where id=$PB")  linhas na junção: $($M "select count(*) from playlist_songs")"
curl -s -o /dev/null -XPOST $A/songs -H "$H $TB" -F title="Samba de Bruno" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
curl -s -o /dev/null -XPOST $A/songs -H "$H $TA" -F title="Ana Forró" -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg"
echo "== 9. BUSCA"
sr(){ curl -s -g "$A/search?$1" | python3 -c "
import sys,json
raw=sys.stdin.read(); d=json.loads(raw)['data']
print('query',repr(d['query']),'| songs',[(s['title'],s['author']['username']) for s in d['songs']],'| users',[u['username'] for u in d['users']],'| password' if 'password' in raw else '')"; }
echo "sem q              : $(sr '')"
echo "q= (vazio)         : $(sr 'q=')"
echo "q=%20%20           : $(sr 'q=%20%20')"
echo "q=s (1 letra)      : $(sr 'q=s')"
echo "q=samba            : $(sr 'q=samba')"
echo "q=SAMBA (maiúsc.)  : $(sr 'q=SAMBA')"
echo "q=bru (username)   : $(sr 'q=bru')"
echo "q=zzzz             : $(sr 'q=zzzz')"
echo "q=ab&q=cd          : $(sr 'q=ab&q=cd')  status $(c -g "$A/search?q=ab&q=cd")"
echo "q[x]=1             : $(sr 'q[x]=1')  status $(c -g "$A/search?q[x]=1")"
echo "q=%25%25 (%%)      : $(sr 'q=%25%25')"
echo "q=__               : $(sr 'q=__')"
echo "q=100%25 (trecho real com %): $(sr 'q=100%25')"
echo "== 10. UNIQUE"
$M "insert into playlist_songs (playlist_id,song_id,created_at,updated_at) select playlist_id,song_id,now(),now() from playlist_songs limit 1" 2>&1 | head -1
S3=$($M "select id from songs where title='Samba de Bruno'"); add $PB $TB "{\"songId\":$S3}" >/dev/null
$M "insert into playlist_songs (playlist_id,song_id,created_at,updated_at) values ($PB,$S3,now(),now())" 2>&1 | grep ERROR
echo "== 11. REGRESSÃO"
curl -s -o /dev/null -XPOST $A/users/$($M "select id from users where username='bruno'")/toggle-follow -H "$H $TA"
SA=$($M "select id from songs where title like 'Ana For%'")
echo "feed $(c $A/feed -H "$H $TA")  detalhe $(c $A/songs/$S3)  perfil $(c $A/profile/bruno)  curtir $(c -XPOST $A/songs/$S3/toggle-like -H "$H $TA")  comentar $(c -XPOST $A/songs/$S3/comments -H "$H $TA" -H "$J" -d '{"content":"top"}')  seguir-status $(c $A/users/2/follow-status -H "$H $TA")"
echo "followers $(c $A/users/2/followers)  following $(c $A/users/1/following)  feed-seguindo $(c $A/following-songs -H "$H $TA")  meus itens $(c $A/my-songs -H "$H $TA")  curtidas $(c $A/liked-songs -H "$H $TA")"
echo "edição $(c -XPUT $A/songs/$SA -H "$H $TA" -F title='Ana Forró 2')  upload $(c -XPOST $A/songs -H "$H $TA" -F title='Outra' -F "audio=@$F/teste.wav;type=audio/wav" -F "cover=@$F/capa.jpg;type=image/jpeg")"
echo "GET /users/abc/followers -> $(curl -s -w ' [%{http_code}]' $A/users/abc/followers | sed -E 's/"errors":\[[^]]*\]\}//')"
