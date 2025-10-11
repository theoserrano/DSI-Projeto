import { NOTIFICATION_TYPES, Notification, NotificationType } from "@/types/notifications";

export type PartitionedNotifications = {
  friendRequests: Notification[];
  general: Notification[];
};

export function isNotificationType(notification: Notification, type: NotificationType) {
  return notification.type === type;
}

export function isFriendRequest(notification: Notification): boolean {
  return isNotificationType(notification, NOTIFICATION_TYPES.FRIEND_REQUEST);
}

export function partitionNotifications(notifications: Notification[]): PartitionedNotifications {
  return notifications.reduce<PartitionedNotifications>(
    (acc, notification) => {
      if (isFriendRequest(notification)) {
        acc.friendRequests.push(notification);
      } else {
        acc.general.push(notification);
      }
      return acc;
    },
    { friendRequests: [], general: [] }
  );
}
