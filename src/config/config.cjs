require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres.ngjrnpiopnjfcwyifslo',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    host: 'aws-1-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
