import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    # need to get the same query namme in the resolver
    authUser {
        _id
        username
        name
        profilePicture
    }
  }
`;