import { Resolvers } from "../../types";

interface SeePhotoCommentArgs {
  id: number;
  [key: string]: any;
}

const resolver: Resolvers<SeePhotoCommentArgs> = {
  Query: {
    seePhotoComments: (_, { id }: SeePhotoCommentArgs, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createAt: "asc",
        },
      }),
  },
};

export default resolver;
