import { Resolvers } from "../../types";

interface SeePhotoArgs {
  id: number;
  [key: string]: any;
}

const resolvers: Resolvers<SeePhotoArgs> = {
  Query: {
    seePhoto: async (_, { id }: SeePhotoArgs, { client, loggedInUser }) =>
      client.photo.findUnique({
        where: {
          id: +id,
        },
      }),
  },
};

export default resolvers;
