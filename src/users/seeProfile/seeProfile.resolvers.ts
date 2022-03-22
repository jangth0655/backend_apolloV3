import client from "../../client";

interface SeeProfileArgs {
  username: string;
  [key: string]: any;
}

export default {
  Query: {
    seeProfile: async (_, { username }: SeeProfileArgs) =>
      await client.user.findUnique({
        where: {
          username,
        },
      }),
  },
};

// findUnique -> unique한 필드만 찾아본다.
