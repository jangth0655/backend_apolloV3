import { createWriteStream } from "fs";
import { protectResolver } from "../users.utilits";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";
import { uploadToS3 } from "../../shared/shared.utils";

const { GraphQLUpload } = require("graphql-upload");

interface EditProfileResolver {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

const resolvers: Resolvers<EditProfileResolver> = {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectResolver(
      async (
        _: any,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        }: EditProfileResolver,
        { loggedInUser, client }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
          /* const { filename, createReadStream } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`; */
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }

        const updateUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
          },
        });
        if (updateUser.id) {
          return {
            ok: true,
          };
        } else {
          return { ok: false, error: "Could not update profile" };
        }
      }
    ),
  },
};

export default resolvers;
