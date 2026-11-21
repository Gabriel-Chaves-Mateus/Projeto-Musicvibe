// Uso:  node scripts/setAdmin.js <username>        -> promove a administrador
//       node scripts/setAdmin.js <username> off    -> rebaixa
// Não existe rota HTTP para isso: virar administrador exige acesso ao servidor/banco.
require('dotenv').config();

const sequelize = require('../config/database');
const { User } = require('../config/associations');

async function main() {
  const username = process.argv[2];
  const demote = process.argv[3] === 'off';

  if (!username) {
    console.log('Uso: node scripts/setAdmin.js <username> [off]');
    process.exitCode = 1;
    return;
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log(`Usuário "${username}" não encontrado.`);
      process.exitCode = 1;
      return;
    }

    await user.update({ isAdmin: !demote });
    console.log(`${user.username}: isAdmin = ${!demote}`);
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
