import { gql } from "apollo-server";

//타입은 prisma스키마와 동일해야한다. 그래서 제거하지 않는다.
export default gql`
  type User {
    id: Int!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createAt: String!
    updateAt: String!
    bio: String
    avatar: String
    followers: [User]
    following: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
    photo: [Photo]
  }
`;
