const { GraphQLUpload } = require("graphql-upload");
import { uploadToS3 } from "../../shared/shared.utils";
import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";
import { processHashtags } from "../photo.utility";

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
        let hashtagObj = []!;
        if (caption) {
          hashtagObj = processHashtags(caption);
        }
        // get or create hashtags
        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
        return await client.photo.create({
          data: {
            file: fileUrl,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(true && {
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

// parse caption
/* const hashtags: string[] = caption.match(/#[\w]+/g); */
/*  hashtags.map((hashtag) => ({
            where: { hashtag },
            create: { hashtag },
          })) */
