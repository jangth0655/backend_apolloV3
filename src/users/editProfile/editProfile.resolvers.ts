import { createWriteStream } from "fs";
import { protectResolver } from "../users.utilits";
import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

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
        const { filename, createReadStream } = await avatar;
        const readStream = createReadStream();
        const writeStream = createWriteStream(
          process.cwd() + "/uploads/" + filename
        );
        readStream.pipe(writeStream);

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
            ...(uglyPassword && { password: uglyPassword }),
            bio,
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
