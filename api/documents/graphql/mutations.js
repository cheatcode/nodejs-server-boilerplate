import Documents from "../index";
import generateId from "../../../lib/generateId";
import isDocumentOwner from "../../../lib/isDocumentOwner";

export default {
  createDocument: async (parent, args, context) => {
    const _id = generateId();

    await Documents.insertOne({
      _id,
      userId: context.user._id,
      ...args.document,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      _id,
    };
  },
  updateDocument: async (parent, args, context) => {
    await isDocumentOwner(args.documentId, context.user._id);

    await Documents.updateOne(
      { _id: args.documentId },
      {
        $set: {
          ...args.document,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return {
      _id: args.documentId,
    };
  },
  deleteDocument: async (parent, args, context) => {
    await isDocumentOwner(args.documentId, context.user._id);
    await Documents.deleteOne({ _id: args.documentId });
  },
};
