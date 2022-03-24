import { ok } from "assert";
import client from "../../client";
import { Resolvers } from "../../types";
import { protectResolver } from "../users.utilits";

interface FollowArg {
  username: string;
  [key: string]: any;
}

const resolvers: Resolvers<FollowArg> = {
  Mutation: {
    followUser: protectResolver(
      async (_, { username }: FollowArg, { loggedInUser }) => {
        const ok = await client.user.findUnique({
          where: {
            username,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: "That user does not exist.",
          };
        }
        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              connect: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
