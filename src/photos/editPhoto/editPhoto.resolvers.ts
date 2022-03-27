import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";
import { processHashtags } from "../photo.utility";

interface EditPhotoArgs {
  id: number;
  caption: string;
}

const resolvers: Resolvers<EditPhotoArgs> = {
  Mutation: {
    editPhoto: protectResolver(
      async (_, { id, caption }: EditPhotoArgs, { loggedInUser, client }) => {
        const oldPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });
        if (!oldPhoto) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }
        const photo = await client.photo.update({
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
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

export default resolvers;
