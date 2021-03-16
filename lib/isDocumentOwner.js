import Documents from "../api/documents";

export default async (documentId = null, currentUserId = null) => {
  if (!documentId || !currentUserId) return null;

  const document = await Documents.findOne(
    { _id: documentId },
    { projection: { userId: 1 } }
  );

  if (document?.userId !== currentUserId) {
    throw new Error(
      "Sorry, you need to be the owner of this document to do this."
    );
  }

  return true;
};
