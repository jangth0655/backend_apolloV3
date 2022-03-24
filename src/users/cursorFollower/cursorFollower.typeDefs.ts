import { gql } from "apollo-server";
export default gql`
  type cursorFollowerResult {
    ok: Boolean!
    error: String
    following: [User]
  }

  type Query {
    cursorFollower(username: String!, lastId: Int): cursorFollowerResult
  }
`;
