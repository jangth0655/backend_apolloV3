import client from "../client";
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
    createAccount: async (
      _: any,
      { firstName, lastName, username, email, password }: AccountArgs
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if (existingUser) {
          throw new Error("This is username/email is already taken.");
        }
        const uglyPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return user;
      } catch (error) {
        return error;
      }
    },
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
    },
  },
};
