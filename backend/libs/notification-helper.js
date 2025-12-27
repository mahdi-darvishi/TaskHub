import Notification from "../models/notification.js";

export const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  relatedId,
  relatedModel,
  workspace,
}) => {
  try {
    if (recipient.toString() === sender.toString()) return;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      relatedId,
      relatedModel,
      workspace,
    });

    // TODO: اینجا بعداً Socket.io را اضافه می‌کنیم که همون لحظه زنگوله کاربر صدا بخوره
    // if (global.io) { ... }

    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
  }
};
