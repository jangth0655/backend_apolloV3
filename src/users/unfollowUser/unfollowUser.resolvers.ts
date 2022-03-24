import { protectResolver } from "../users.utilits";
import { Resolvers } from "../../types";
import client from "../../client";

interface UnfollowArgs {
  username: string;
  [key: string]: any;
}

const resolvers: Resolvers<UnfollowArgs> = {
  Mutation: {
    unfollowUser: protectResolver(
      async (_, { username }: UnfollowArgs, { loggedInUser }) => {
        const ok = await client.user.findUnique({
          where: { username },
        });
        if (!ok) {
          return {
            ok: false,
            error: "Can't unfollow user.",
          };
        }
        try {
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                disconnect: {
                  username,
                },
              },
            },
          });
          return {
            ok: true,
          };
        } catch (error) {
          return {
            ok: false,
            error,
          };
        }
      }
    ),
  },
};

export default resolvers;
