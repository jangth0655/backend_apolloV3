import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

const resolver: Resolvers<any> = {
  Query: {
    seeFeed: protectResolver((_, {}, { loggedInUser, client }) =>
      client.photo.findMany({
        where: {
          OR: [
            {
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createAt: "desc",
        },
      })
    ),
  },
};

export default resolver;
