const { GraphQLUpload } = require("graphql-upload");
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface UploadPhotoArgs {
  [key: string]: any;
}

const resolvers: Resolvers<UploadPhotoArgs> = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadPhoto: protectResolver(
      async (
        _,
        { file, caption }: UploadPhotoArgs,
        { loggedInUser, client }
      ) => {
        let hashtagObj = [] as any;
        if (caption) {
          // parse caption
          const hashtags: string[] = caption.match(/#[\w]+/g);
          hashtagObj = hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          }));
        }
        // get or create hashtags
        return await client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObj,
              },
            }),
          },
        });
      }
      //save photo With the parsed hashtags
      // add the photo to the hashtags
    ),
  },
};

export default resolvers;
