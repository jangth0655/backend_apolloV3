import { Resolvers } from "../../types";

interface SeePhotoLikes {
  id: number;
  [key: string]: any;
}

const resolver: Resolvers<SeePhotoLikes> = {
  Query: {
    seePhotoLikes: async (
      _,
      { id }: SeePhotoLikes,
      { client, loggedInUser }
    ) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      return likes.map((like) => like.user);
    },
  },
};

export default resolver;
