const DocumentFields = `
  title: String
  status: DocumentStatus
  createdAt: String
  updatedAt: String
  content: String
`;

export default `
  type Document {
    _id: ID
    userId: ID
    ${DocumentFields}
  }

  enum DocumentStatus {
    draft
    published
  }

  input DocumentInput {
    ${DocumentFields}
  }
`;
