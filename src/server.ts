import "dotenv/config";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { createServer, Server } from "http";
import { getUser } from "./users/users.utilits";
import { typeDefs, resolvers } from "./schema";
import client from "./client";
import { execute, subscribe } from "graphql";
import schema from "./schema";
import pubsub from "./pubsub";

const PORT = process.env.PORT;

const startServer = async (): Promise<void> => {
  const app = express();
  app.use(logger("tiny"));
  app.use(graphqlUploadExpress());
  //upload 폴더를 브라우저에 올리는 것
  app.use("/static", express.static("uploads"));

  const apollo: ApolloServer<ExpressContext | any> = new ApolloServer({
    schema,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
          client,
        };
      } else {
        const {
          connection: { context },
        } = ctx;
        return {
          loggedInUser: context.loggedInUser,
        };
      }
    },
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  const httpServer: Server = createServer(app);
  const subscriptionServer: SubscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams, webSocket, context) {
        console.log("onConnect!");
        const { token } = connectionParams;
        if (!token) {
          throw new Error("토큰이 존재하지 않습니다.");
        }
        const loggedInUser = await getUser(token);
        return { loggedInUser };
      },
      onDisconnect(webSocket, context) {
        console.log("onDisconnect!");
      },
    },

    { server: httpServer, path: apollo.graphqlPath }
  );

  await apollo.start();
  apollo.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
  );
};
startServer();

/* await new Promise((resolve) => httpServer.listen(PORT, resolve));
  console.log(`🚀 Server:http://localhost${PORT}${apollo.graphqlPath}`); */

/*  httpServer.listen(process.env.PORT, () =>
    console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`)
  ); */
