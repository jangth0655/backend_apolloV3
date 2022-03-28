import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers<any> = {
  Room: {
    users: ({ id }, {}, { client }) =>
      client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }, {}, { client }) =>
      client.message.findMany({ where: { roomId: id } }),
    unreadTotal: ({ id }, {}, { client, loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }, {}, { client }) =>
      client.message.findUnique({ where: { id } }).user(),
  },
};

export default resolvers;
