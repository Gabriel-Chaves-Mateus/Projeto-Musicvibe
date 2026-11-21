const path = require('path');

var express = require('express');
var logger = require('morgan');
var cors = require('cors');

require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRoutes = require('./modules/search/searchRoutes');
var userRoutes = require('./modules/user/userRoutes');
var songRoutes = require('./modules/song/songRoutes');
var likeRoutes = require('./modules/like/likeRoutes');
var commentRoutes = require('./modules/comment/commentRoutes');
var followRoutes = require('./modules/follow/followRoutes');
var playlistRoutes = require('./modules/playlist/playlistRoutes');
var notificationRoutes = require('./modules/notification/notificationRoutes');
var reportRoutes = require('./modules/report/reportRoutes');
var adminRoutes = require('./modules/admin/adminRoutes');
var errorHandler = require('./middlewares/errorHandler');

var app = express();

app.use(logger('dev'));

// CORS ANTES dos parsers: se o express.json() falhar (ex.: corpo "null" => 400),
// o erro pula direto para o errorHandler; com o cors depois, a resposta de erro
// sairia sem Access-Control-Allow-Origin e o navegador mostraria "erro de CORS".
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(
  '/uploads',
  express.static(
    path.join(__dirname, 'public/uploads')
  )
);

app.use('/api', indexRouter);
app.use('/api', searchRoutes);
app.use('/api', userRoutes);
app.use('/api', songRoutes);
app.use('/api', likeRoutes);
app.use('/api', commentRoutes);
app.use('/api', followRoutes);
app.use('/api', playlistRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reportRoutes);
app.use('/api', adminRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.',
        errors: []
    });
});

app.use(errorHandler);

// Associações precisam ser carregadas ANTES do sync, senão a FK não é criada.
require('./config/associations');
const sequelize = require('./config/database');

sequelize.sync({ alter: true })
    .then(() => console.log('Banco de dados sincronizado!'))
    .catch(err => console.error('Erro ao sincronizar banco:', err));

module.exports = app;