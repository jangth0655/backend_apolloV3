import { Resolvers } from "../types";

interface SearchUserArgs {
  [key: string]: any;
}

const resolvers: Resolvers<SearchUserArgs> = {
  Query: {
    searchUsers: async (_, { keyword }: SearchUserArgs, { client }) =>
      await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      }),
  },
};

export default resolvers;
