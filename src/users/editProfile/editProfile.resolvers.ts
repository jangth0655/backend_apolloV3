import * as bcrypt from "bcrypt";
import client from "../../client";
var jwt = require("jsonwebtoken");

interface EditProfileResolver {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

export default {
  Mutation: {
    editProfile: async (
      _: any,
      {
        firstName,
        lastName,
        username,
        email,
        password: newPassword,
      }: EditProfileResolver,
      { token }
    ) => {
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
      }

      const updateUser = await client.user.update({
        where: {
          id: 11,
        },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(uglyPassword && { password: uglyPassword }),
        },
      });
      if (updateUser.id) {
        return {
          ok: true,
        };
      } else {
        return { ok: false, error: "Could not update profile" };
      }
    },
  },
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTY0Nzk1OTI3N30.v5YGp_eYaN_gz3kzqyZHGSmeY6CsZP8o0ycjHPjAn78
