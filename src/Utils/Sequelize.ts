import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

export const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  benchmark: true,
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  operatorsAliases: Op,
  models: [`${__dirname}/../Models`]
});
