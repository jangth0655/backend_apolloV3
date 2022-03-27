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
    likes: Int!
    isMine: Boolean!
    comments: Int!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhoto: Int!
    createAt: String!
    updateAt: String!
  }

  type Like {
    id: Int!
    photo: Photo!
    createAt: String!
    updateAt: String!
  }
`;
