const UserFields = `
  _id: ID
  emailAddress: String
`;

const NameFields = `
  first: String
  last: String
`;

export default `
  type User {
    ${UserFields}
    name: Name
  }

  type Name {
    ${NameFields}
  }

  input UserInput {
    ${UserFields}
    password: String
    name: NameInput
  }

  input NameInput {
    ${NameFields}  
  }
`;
