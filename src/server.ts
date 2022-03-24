import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";

import { getUser } from "./users/users.utilits";
import { typeDefs, resolvers } from "./schema";
import client from "./client";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });
  await apollo.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(logger("tiny"));
  //upload 폴더를 브라우저에 올리는 것
  app.use("/static", express.static("uploads"));
  apollo.applyMiddleware({ app });
  await new Promise((FUNC: any) => app.listen({ port: PORT }, FUNC));
  console.log(`🚀 Server:http://localhost${PORT}${apollo.graphqlPath}`);
};

startServer();
