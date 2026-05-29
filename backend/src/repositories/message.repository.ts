import { MessageModel } from "../models/message.model";

interface CreateMessageData {
  groupId: number;
  userId: number;
  content: string;
}

export const messageRepository = {
  findByGroupId(groupId: number) {
    return MessageModel.find({
      groupId,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .lean();
  },

  findById(id: string) {
    return MessageModel.findById(id);
  },

  create(data: CreateMessageData) {
    return MessageModel.create({
      groupId: data.groupId,
      userId: data.userId,
      content: data.content,
    });
  },

  softDelete(id: string) {
    return MessageModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { returnDocument: "after" },
    );
  },
};
