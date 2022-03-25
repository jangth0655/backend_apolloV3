import client from "../client";
import { Resolvers } from "../types";

export default {
  User: {
    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      try {
        const exists = await client.user.count({
          where: {
            username: loggedInUser.username,
            following: {
              some: {
                id: id,
              },
            },
          },
        });
        return Boolean(exists);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
