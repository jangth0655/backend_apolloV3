import { gql } from "apollo-server";

//타입은 prisma스키마와 동일해야한다.
const UserType = gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    username: String!
    email: String!
    createAt: String!
    updateAt: String!
  }
  type loginResult {
    ok: Boolean!
    token: String
    error: String
  }
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): User
    login(username: String!, password: String!): loginResult!
  }

  type Query {
    seeProfile(username: String): User
  }
`;

export default UserType;
