import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface SeeRoomArgs {
  id: number;
}

const resolvers: Resolvers<SeeRoomArgs> = {
  Query: {
    seeRoom: protectResolver(
      async (_, { id }: SeeRoomArgs, { client, loggedInUser }) =>
        client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        })
    ),
  },
};

export default resolvers;
