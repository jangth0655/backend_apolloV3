import { gql } from "apollo-server";
export default gql`
  scalar Upload
  type MutationResponse {
    ok: Boolean!
    error: String
  }
`;
