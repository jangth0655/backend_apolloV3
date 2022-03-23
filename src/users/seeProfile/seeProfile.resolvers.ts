import { Resolvers } from "../../types";

interface SeeProfileArgs {
  username: string;
  [key: string]: any;
}

const resolvers: Resolvers<SeeProfileArgs> = {
  Query: {
    seeProfile: async (
      _,
      { username }: SeeProfileArgs,
      { loggedInUser, client }
    ) =>
      await client.user.findUnique({
        where: {
          username,
        },
      }),
  },
};

export default resolvers;

// findUnique -> unique한 필드만 찾아본다.
