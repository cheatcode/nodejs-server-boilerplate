import gql from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";

import DocumentTypes from "../documents/graphql/types";
import DocumentQueries from "../documents/graphql/queries";
import DocumentMutations from "../documents/graphql/mutations";

import UserTypes from "../users/graphql/types";
import UserQueries from "../users/graphql/queries";
import UserMutations from "../users/graphql/mutations";

const schema = {
  typeDefs: gql`
    ${DocumentTypes}
    ${UserTypes}

    type Query {
      document(documentId: ID!): Document
      documents: [Document]
      user: User
    }

    type Mutation {
      createDocument(document: DocumentInput!): Document
      deleteDocument(documentId: ID!): Document
      login(emailAddress: String!, password: String!): User
      loginWithToken: User
      logout: Boolean
      recoverPassword(emailAddress: String!): Boolean
      resetPassword(
        token: String!
        newPassword: String!
        repeatNewPassword: String!
      ): Boolean
      signup(user: UserInput): User
      updateDocument(documentId: ID!, document: DocumentInput!): Document
    }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,
      ...UserQueries,
    },
    Mutation: {
      ...DocumentMutations,
      ...UserMutations,
    },
  },
};

export default makeExecutableSchema(schema);
