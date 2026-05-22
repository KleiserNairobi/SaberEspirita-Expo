import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/configs/firebase/firebase";
import { ForumReactionType } from "@/types/forum";
import { NotificationItem, NotificationType } from "@/types/notifications";

function normalizeNotificationType(value: unknown): NotificationType | null {
  if (value === "forum_reaction_received") return value;
  if (value === "forum_new_comment_thread") return value;
  return null;
}

function normalizeReactionType(value: unknown): ForumReactionType | null {
  if (value === "me_tocou") return value;
  if (value === "aprendi_algo") return value;
  if (value === "quero_refletir") return value;
  if (value === "gratidao") return value;
  if (value === "luz") return value;
  return null;
}

function toDateOrNull(value: unknown): Date | null {
  if (!value || typeof value !== "object") return null;
  if (!("toDate" in value)) return null;
  const fn = (value as { toDate?: unknown }).toDate;
  if (typeof fn !== "function") return null;
  const d = fn.call(value) as unknown;
  return d instanceof Date ? d : null;
}

function normalizeString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function mapNotificationDoc(id: string, data: Record<string, unknown>): NotificationItem | null {
  const type = normalizeNotificationType(data.type);
  if (!type) return null;

  const toUserId = normalizeString(data.toUserId);
  if (!toUserId) return null;

  return {
    id,
    type,
    toUserId,
    fromUserId: normalizeString(data.fromUserId),
    courseId: normalizeString(data.courseId),
    lessonId: normalizeString(data.lessonId),
    commentId: normalizeString(data.commentId),
    reactionType: normalizeReactionType(data.reactionType),
    createdAt: toDateOrNull(data.createdAt),
    readAt: toDateOrNull(data.readAt),
  };
}

export async function hasUnreadNotifications(params: { userId: string }): Promise<boolean> {
  const ref = collection(db, `users/${params.userId}/notifications`);
  const q = query(ref, where("readAt", "==", null), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getNotificationsPage(params: {
  userId: string;
  pageSize: number;
  cursor?: unknown;
}): Promise<{ items: NotificationItem[]; cursor: unknown | null }> {
  const ref = collection(db, `users/${params.userId}/notifications`);
  const base = query(ref, orderBy("createdAt", "desc"), limit(params.pageSize));
  const q = params.cursor ? query(base, startAfter(params.cursor as any)) : base;

  const snap = await getDocs(q);
  const docs = snap.docs;

  const items = docs.flatMap((d) => {
    const data = d.data() as Record<string, unknown>;
    const mapped = mapNotificationDoc(d.id, data);
    return mapped ? [mapped] : [];
  });

  const nextCursor = docs.length > 0 ? docs[docs.length - 1] : null;
  return { items, cursor: nextCursor };
}

export async function getNotification(params: {
  userId: string;
  notificationId: string;
}): Promise<NotificationItem | null> {
  const ref = doc(db, `users/${params.userId}/notifications/${params.notificationId}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const mapped = mapNotificationDoc(snap.id, snap.data() as Record<string, unknown>);
  return mapped;
}

export async function markNotificationRead(params: {
  userId: string;
  notificationId: string;
}): Promise<void> {
  const ref = doc(db, `users/${params.userId}/notifications/${params.notificationId}`);
  await updateDoc(ref, { readAt: serverTimestamp() });
}

export async function markAllNotificationsRead(params: { userId: string }): Promise<number> {
  const ref = collection(db, `users/${params.userId}/notifications`);
  const q = query(ref, where("readAt", "==", null), limit(200));
  const snap = await getDocs(q);
  if (snap.empty) return 0;

  const batch = writeBatch(db);
  for (const d of snap.docs) {
    batch.update(d.ref, { readAt: serverTimestamp() });
  }
  await batch.commit();
  return snap.size;
}
