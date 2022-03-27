import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface LikePhotoArgs {
  id: number;
  [key: string]: any;
}

const resolvers: Resolvers<LikePhotoArgs> = {
  Mutation: {
    toggleLike: protectResolver(
      async (_, { id }: LikePhotoArgs, { client, loggedInUser }) => {
        const ok = await client.photo.findUnique({
          where: {
            id,
          },
        });

        if (!ok) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }
        const likeWhere = {
          photoId_userId: {
            userId: loggedInUser.id,
            photoId: id,
          },
        };

        const like = await client.like.findUnique({
          where: likeWhere,
        });
        if (like) {
          await client.like.delete({
            where: likeWhere,
          });
          return {
            ok: true,
          };
        } else {
          await client.like.create({
            data: {
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              photo: {
                connect: {
                  id,
                },
              },
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

export default resolvers;
