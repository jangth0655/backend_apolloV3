import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utilits";
import client from "./client";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  await new Promise((FUNC: any) => app.listen({ port: PORT }, FUNC));
  console.log(`🚀 Server:http://localhost${PORT}${server.graphqlPath}`);
};

startServer();
