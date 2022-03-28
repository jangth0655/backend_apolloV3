import { Resolvers } from "../../types";
import { protectResolver } from "../../users/users.utilits";

interface SeeRoomArgs {
  [key: string]: any;
}

const resolver: Resolvers<SeeRoomArgs> = {
  Query: {
    seeRooms: protectResolver(async (_, {}, { client, loggedInUser }) => {
      const rooms = await client.room.findMany({
        where: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      });
      return rooms;
    }),
  },
};

export default resolver;
