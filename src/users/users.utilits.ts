import client from "../client";
import * as jwt from "jsonwebtoken";
import { Context, Resolver, Resolvers } from "../types";
//const jwt = require("jsonwebtoken");

export const getUser = async (token: any) => {
  if (!token) {
    return null;
  }
  try {
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const protectResolver =
  (resolver: Resolver<any>) =>
  (root: any, args: any, context: Context, info: any): any => {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action",
      };
    }
    return resolver(root, args, context, info);
  };
