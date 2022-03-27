import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface EditCommentArgs {
  id: number;
  payload: string;
}

const resolver: Resolvers<EditCommentArgs> = {
  Mutation: {
    editComment: protectResolver(
      async (_, { id, payload }: EditCommentArgs, { loggedInUser, client }) => {
        const comment = await client.comment.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });
        if (!comment) {
          return {
            ok: false,
            error: "Comment not found",
          };
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized",
          };
        } else {
          await client.comment.update({
            where: {
              id,
            },
            data: {
              payload,
            },
          });
          return {
            ok: true,
          };
        }
      }
    ),
  },
};

export default resolver;
