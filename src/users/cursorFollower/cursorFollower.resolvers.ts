import { Resolvers } from "../../types";

interface CursorFollowerArgs {
  username: string;
  lastId: number;
}

const resolvers: Resolvers<CursorFollowerArgs> = {
  Query: {
    cursorFollower: async (
      _,
      { username, lastId }: CursorFollowerArgs,
      { client, loggedInUser }
    ) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: {
          id: true,
        },
      });

      if (!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }

      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });

      return {
        ok: true,
        following,
      };
    },
  },
};

export default resolvers;
