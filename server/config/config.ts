import path from 'path';

const config = {
  SERVER_SECRET: process.env.SERVER_SECRET || 'abcdefg',
  DATABASE_URL: process.env.DATABASE_URL || '',
  APPNAME: 'iamzae',
  ENVIRONMENT: process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT',
  SOCKET_CONNECT_PRIVELEGE: ['guest', 'user', 'admin'],
  ROOT_DIR: path.normalize(__dirname + `/../../`),
  PORT: process.env.PORT || 3000,
  ROOT_URL: '/',
  ERROR_URL: '/error',
  NODEMAILER: {
    EMAIL: process.env.NODEMAILER_EMAIL || '',
    PASSWORD: process.env.NODEMAILER_PASSWORD || ''
  },
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || ''
};

export default config;