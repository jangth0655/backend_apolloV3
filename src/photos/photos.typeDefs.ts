import { gql } from "apollo-server";
export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    createAt: String!
    updateAt: String!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhoto: Int!
    createAt: String!
    updateAt: String!
  }
`;
