import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface CreateCommentArgs {
  photoId: number;
  payload: string;
}

const resolver: Resolvers<CreateCommentArgs> = {
  Mutation: {
    createComment: protectResolver(
      async (
        _,
        { photoId, payload }: CreateCommentArgs,
        { loggedInUser, client }
      ) => {
        const ok = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: "Photo not found",
          };
        }
        await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
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

export default resolver;
