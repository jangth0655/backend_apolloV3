import client from "../client";
import { Resolvers } from "../types";

type MovieArgs = {
  id: number;
};

const resolvers: Resolvers<MovieArgs> = {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (root: any, { id }: MovieArgs) =>
      client.movie.findUnique({
        where: {
          id,
        },
      }),
  },
};

export default resolvers;
