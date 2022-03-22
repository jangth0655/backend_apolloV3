var jwt = require("jsonwebtoken");
import client from "../../client";
import * as bcrypt from "bcrypt";

interface AccountArgs {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: any;
  [key: string]: any;
}

const SALT_ROUNDS = 10;

// check username or email are already on DB
// password
// save and return user

export default {
  Mutation: {
    login: async (_: any, { username, password }: AccountArgs) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Incorrect paswword",
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
