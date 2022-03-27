import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface DeletePhotoArgs {
  id: number;
  [key: string]: any;
}

const resolver: Resolvers<DeletePhotoArgs> = {
  Mutation: {
    deletePhoto: protectResolver(
      async (_, { id }: DeletePhotoArgs, { loggedInUser, client }) => {
        const photo = await client.photo.findUnique({
          where: {
            id,
          },
          select: {
            userId: true,
          },
        });
        if (!photo) {
          return {
            ok: false,
            error: "Photo not found",
          };
        } else if (photo.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized",
          };
        } else {
          await client.photo.delete({
            where: {
              id,
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
