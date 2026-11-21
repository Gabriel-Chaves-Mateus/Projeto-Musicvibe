# Curls da Parte A (tire um print de cada um, em .jpg)

Pré-requisito: API rodando em `localhost:3000` e um usuário cadastrado. Obtenha o token:

```bash
curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}'
# copie o valor de data.token e use no lugar de $TOKEN
```

> O `;type=...` é necessário no curl porque o filtro do Multer confere o MIME type de cada arquivo.

## 1. Sucesso → 201 e `songsCount` sobe
```bash
curl -i -X POST http://localhost:3000/api/songs \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Minha música" -F "description=Teste" \
  -F "audio=@musica.mp3;type=audio/mpeg" \
  -F "cover=@capa.jpg;type=image/jpeg"

curl -s http://localhost:3000/api/profile/me -H "Authorization: Bearer $TOKEN"   # songsCount +1
```

## 2. Sem token → 401
```bash
curl -i -X POST http://localhost:3000/api/songs \
  -F "title=x" -F "audio=@musica.mp3;type=audio/mpeg" -F "cover=@capa.jpg;type=image/jpeg"
```

## 3. Sem título → 400
```bash
curl -i -X POST http://localhost:3000/api/songs -H "Authorization: Bearer $TOKEN" \
  -F "audio=@musica.mp3;type=audio/mpeg" -F "cover=@capa.jpg;type=image/jpeg"
```

## 4. Sem a capa (só um dos dois arquivos) → 400
```bash
curl -i -X POST http://localhost:3000/api/songs -H "Authorization: Bearer $TOKEN" \
  -F "title=x" -F "audio=@musica.mp3;type=audio/mpeg"
```

## 5. Tipo de arquivo inválido → 400
```bash
curl -i -X POST http://localhost:3000/api/songs -H "Authorization: Bearer $TOKEN" \
  -F "title=x" -F "audio=@nota.txt;type=text/plain" -F "cover=@capa.jpg;type=image/jpeg"
```

Confirme também no banco: `SELECT id, title, audio, cover, user_id FROM songs;` e `DESCRIBE songs;` (FK `user_id` → `users`).
