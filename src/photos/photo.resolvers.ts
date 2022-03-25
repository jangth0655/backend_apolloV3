import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers<any> = {
  Photo: {
    user: async ({ userId }) =>
      await client.user.findUnique({ where: { id: userId } }),
    hashtags: async ({ id }) =>
      await client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
  },
  Hashtag: {
    photos: async ({ id }, { page }) => {
      return await client.hashtag.findUnique({ where: { id: id } }).photos();
    },

    totalPhoto: async ({ id }) =>
      await client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
