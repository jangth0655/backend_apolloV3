import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";

const server = new ApolloServer({
  schema,
  context: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY0Nzk1OTI3N30.v5YGp_eYaN_gz3kzqyZHGSmeY6CsZP8o0ycjHPjAn78",
  },
});

const PORT = process.env.PORT;

server
  .listen()
  .then(() =>
    console.log(`🚀 Server is running on  http://localhost:${PORT}/ ✅`)
  );
