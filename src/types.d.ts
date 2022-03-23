import { PrismaClient, User } from "@prisma/client";

type Context = {
  loggedInUser?: User;
  client: PrismaClient;
};

export type Resolver<T> = (
  root: any,
  args: T | any,
  context: Context,
  info: any
) => any;

export type Resolvers<T> = {
  [key: string]: {
    [key: string]: Resolver<T>;
  };
};
