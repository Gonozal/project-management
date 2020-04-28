import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import expressJwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import dotenv from 'dotenv-safe';

import { customAuthChecker } from './Utils/CustomAuthChecker';
import { sequelize } from './Utils/Sequelize';
import { createContext } from 'dataloader-sequelize';
import Seed from './Migrations/Seed';

const PORT = process.env.PORT || 5000;
const GQL_PATH = '/graphql';

dotenv.config();

const main = async () => {
  try {
    await sequelize.sync({ force: true });
    await Seed.up();
  } catch (e) {
    console.error(e);
    throw e;
  }
  let schema: GraphQLSchema;
  try {
    schema = await buildSchema({
      authChecker: customAuthChecker,
      emitSchemaFile: path.resolve(__dirname, '..', 'schema', 'schema.graphql'),
      // .js instead of .ts because ts will transpile into js
      resolvers: [`${__dirname}/Controllers/*.resolver.js`]
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  const app = express();

  const server = new ApolloServer({
    context: ({ req, res }) => ({
      req,
      res,
      context: createContext(sequelize)
    }),
    introspection: true,
    playground: true,
    schema
  });

  app.use(express.static(path.join(__dirname, '..', 'build')));
  app.use(cookieParser());
  app.use(
    GQL_PATH,
    expressJwt({
      credentialsRequired: false,
      secret: process.env.CRYPTO_KEY as string,
      getToken: req => {
        if (req.cookies && req.cookies.token) {
          return req.cookies.token;
        } else if (
          req.headers.authorization &&
          req.headers.authorization.split(' ')[0] === 'Bearer'
        ) {
          return req.headers.authorization.split(' ')[1];
        }
        return null;
      }
    })
  );
  app.use(bodyParser.json()); // support json encoded bodies

  server.applyMiddleware({ app, path: GQL_PATH });

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

main();
