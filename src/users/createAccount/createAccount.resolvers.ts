import * as bcrypt from "bcrypt";
import client from "../../client";

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
        const createUser = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        if (createUser) {
          return {
            ok: true,
          };
        }
      } catch (error) {
        return error;
      }
    },
  },
};
