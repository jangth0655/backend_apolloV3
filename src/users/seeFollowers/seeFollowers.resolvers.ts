import { Resolvers } from "../../types";

interface SeeFollowArgs {
  username: string;
  page: number;
}

const resolvers: Resolvers<SeeFollowArgs> = {
  Query: {
    seeFollowers: async (
      _,
      { username, page }: SeeFollowArgs,
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
          error: "Not found user",
        };
      }
      try {
        const followers = await client.user
          .findUnique({ where: { username } })
          .followers({
            take: 5,
            skip: (page - 1) * 5,
          });
        const totalFollowers = await client.user.count({
          where: { following: { some: { username } } },
        });
        return {
          ok: true,
          followers,
          totalPage: Math.ceil(totalFollowers / 5),
        };
      } catch (error) {
        return {
          ok: false,
          error,
        };
      }
    },
  },
};

export default resolvers;
