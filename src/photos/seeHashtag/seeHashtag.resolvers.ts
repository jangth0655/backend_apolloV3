import { Resolvers } from "../../types";

interface SeeHashtagsArgs {
  hashtag: string;
  [key: string]: any;
}

const resolvers: Resolvers<SeeHashtagsArgs> = {
  Query: {
    seeHashtag: async (
      _,
      { hashtag }: SeeHashtagsArgs,
      { client, loggedInUser }
    ) =>
      await client.hashtag.findUnique({
        where: {
          hashtag,
        },
      }),
  },
};

export default resolvers;
