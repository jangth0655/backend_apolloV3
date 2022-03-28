import { gql } from "apollo-server";
export default gql`
  type Message {
    id: Int!
    createAt: String!
    updateAt: String!
    payload: String!
    user: User!
    Room: String!
    read: Boolean!
  }
  type Room {
    id: Int!
    unreadTotal: Int!
    createAt: String!
    updateAt: String!
    users: [User]
    messages: [Message]
  }
`;
