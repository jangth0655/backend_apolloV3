import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface DeleteCommentArgs {
  id: number;
}

const resolver: Resolvers<any> = {
  Mutation: {
    deleteComment: protectResolver(
      async (_, { id }: DeleteCommentArgs, { client, loggedInUser }) => {
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
          await client.comment.delete({
            where: { id },
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
