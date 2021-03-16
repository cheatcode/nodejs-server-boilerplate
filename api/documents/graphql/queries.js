import isDocumentOwner from "../../../lib/isDocumentOwner";
import Documents from "../index";

export default {
  documents: async (parent, args, context) => {
    return Documents.find({ userId: context.user._id }).toArray();
  },
  document: async (parent, args, context) => {
    await isDocumentOwner(args.documentId, context.user._id);

    return Documents.findOne({
      _id: args.documentId,
      userId: context.user._id,
    });
  },
};
