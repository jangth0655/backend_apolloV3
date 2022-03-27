import { Resolvers } from "../../types";

interface SearchPhotoArgs {
  keyword: string;
  [key: string]: any;
}

const resolvers: Resolvers<SearchPhotoArgs> = {
  Query: {
    searchPhotos: (_, { keyword }: SearchPhotoArgs, { client, loggedInUser }) =>
      client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
      }),
  },
};

export default resolvers;
