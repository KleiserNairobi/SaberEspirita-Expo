import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { db, functions } from "@/configs/firebase/firebase";
import {
  CommunityLevelId,
  CommunityProgress,
  ForumComment,
  ForumReactionType,
} from "@/types/forum";

function normalizeCommunityLevelId(value: unknown): CommunityLevelId {
  return value === "cultivador" || value === "arvore_frondosa" ? value : "sementeiro";
}

function normalizeReactionCounts(value: unknown): Record<ForumReactionType, number> {
  const obj =
    typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
  const n = (k: ForumReactionType) =>
    typeof obj[k] === "number" ? (obj[k] as number) : 0;
  return {
    me_tocou: n("me_tocou"),
    aprendi_algo: n("aprendi_algo"),
    quero_refletir: n("quero_refletir"),
    gratidao: n("gratidao"),
    luz: n("luz"),
  };
}

export async function getCommunityProgress(
  userId: string
): Promise<CommunityProgress | null> {
  const ref = doc(db, "community_progress", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data() as any;
  const stats = data.stats ?? {};
  const reactionsReceivedRaw = stats.reactionsReceived ?? {};

  const rr = {
    me_tocou:
      typeof reactionsReceivedRaw.me_tocou === "number"
        ? reactionsReceivedRaw.me_tocou
        : 0,
    aprendi_algo:
      typeof reactionsReceivedRaw.aprendi_algo === "number"
        ? reactionsReceivedRaw.aprendi_algo
        : 0,
    quero_refletir:
      typeof reactionsReceivedRaw.quero_refletir === "number"
        ? reactionsReceivedRaw.quero_refletir
        : 0,
    gratidao:
      typeof reactionsReceivedRaw.gratidao === "number"
        ? reactionsReceivedRaw.gratidao
        : 0,
    luz: typeof reactionsReceivedRaw.luz === "number" ? reactionsReceivedRaw.luz : 0,
    total:
      typeof reactionsReceivedRaw.total === "number" ? reactionsReceivedRaw.total : 0,
  };

  return {
    userId: snap.id,
    communityLevelId: normalizeCommunityLevelId(data.communityLevelId),
    stats: {
      lessonsCompleted:
        typeof stats.lessonsCompleted === "number" ? stats.lessonsCompleted : 0,
      coursesCompleted:
        typeof stats.coursesCompleted === "number" ? stats.coursesCompleted : 0,
      forumComments: typeof stats.forumComments === "number" ? stats.forumComments : 0,
      reactionsReceived: rr,
      activeDays: typeof stats.activeDays === "number" ? stats.activeDays : 0,
      lastActiveAt: stats.lastActiveAt?.toDate?.() ?? null,
      hasCourseOver50:
        typeof stats.hasCourseOver50 === "boolean" ? stats.hasCourseOver50 : false,
    },
  };
}

export async function createForumComment(params: {
  courseId: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  userCommunityLevel: CommunityLevelId;
  content: string;
  isAnonymous: boolean;
}): Promise<string> {
  const ref = collection(db, `lesson_forums/${params.lessonId}/comments`);
  const docRef = await addDoc(ref, {
    lessonId: params.lessonId,
    courseId: params.courseId,
    userId: params.userId,
    userName: params.isAnonymous ? "Estudante Anônimo" : params.userName,
    userAvatar: params.isAnonymous ? null : params.userAvatar,
    isAnonymous: params.isAnonymous,
    userCommunityLevel: params.userCommunityLevel,
    content: params.content,
    createdAt: serverTimestamp(),
    updatedAt: null,
    reactions: {
      me_tocou: 0,
      aprendi_algo: 0,
      quero_refletir: 0,
      gratidao: 0,
      luz: 0,
    },
    isDeleted: false,
    deletedAt: null,
  });

  return docRef.id;
}

export async function softDeleteForumComment(params: {
  lessonId: string;
  commentId: string;
}): Promise<void> {
  const ref = doc(db, `lesson_forums/${params.lessonId}/comments/${params.commentId}`);
  await updateDoc(ref, {
    isDeleted: true,
    deletedAt: serverTimestamp(),
  });
}

export async function setForumReaction(params: {
  lessonId: string;
  commentId: string;
  userId: string;
  type: ForumReactionType;
}): Promise<void> {
  const call = httpsCallable(functions, "setForumReactionCallable");
  await call({
    lessonId: params.lessonId,
    commentId: params.commentId,
    action: "set",
    type: params.type,
  });
}

export async function removeForumReaction(params: {
  lessonId: string;
  commentId: string;
  userId: string;
}): Promise<void> {
  const call = httpsCallable(functions, "setForumReactionCallable");
  await call({
    lessonId: params.lessonId,
    commentId: params.commentId,
    action: "remove",
  });
}

export async function setForumLastSeen(params: {
  userId: string;
  lessonId: string;
}): Promise<void> {
  const ref = doc(db, `users/${params.userId}/forumLastSeen/${params.lessonId}`);
  await setDoc(
    ref,
    {
      userId: params.userId,
      lessonId: params.lessonId,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function hasNewForumComments(params: {
  userId: string;
  lessonId: string;
}): Promise<boolean> {
  const seenRef = doc(db, `users/${params.userId}/forumLastSeen/${params.lessonId}`);
  const seenSnap = await getDoc(seenRef);
  if (!seenSnap.exists()) return false;

  const lastSeenAt = seenSnap.data().lastSeenAt?.toDate?.() ?? null;
  if (!lastSeenAt) return false;

  const commentsRef = collection(db, `lesson_forums/${params.lessonId}/comments`);
  const q = query(commentsRef, where("createdAt", ">", lastSeenAt), limit(1));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getForumCommentsPage(params: {
  lessonId: string;
  courseId: string;
  userId: string;
  pageSize: number;
  cursor?: unknown;
}): Promise<{ comments: ForumComment[]; cursor: unknown | null }> {
  const commentsRef = collection(db, `lesson_forums/${params.lessonId}/comments`);
  const base = query(
    commentsRef,
    where("courseId", "==", params.courseId),
    orderBy("createdAt", "desc"),
    limit(params.pageSize)
  );
  const q = params.cursor ? query(base, startAfter(params.cursor as any)) : base;

  let snap;
  try {
    snap = await getDocs(q);
  } catch (err) {
    if (__DEV__) {
      console.warn("[Forum] getForumCommentsPage failed:", err);
      const msg = String((err as any)?.message ?? err ?? "");
      const match = msg.match(/https?:\/\/\S+/);
      if (match?.[0]) {
        console.warn("[Forum] Firestore index URL:", match[0]);
      }
    }
    throw err;
  }

  const docs = snap.docs;

  const myReactions = await Promise.all(
    docs.map(async (d) => {
      const reactionRef = doc(
        db,
        `lesson_forums/${params.lessonId}/comments/${d.id}/reactions/${params.userId}`
      );
      const reactionSnap = await getDoc(reactionRef);
      const type = reactionSnap.exists()
        ? (reactionSnap.data().type as ForumReactionType)
        : null;
      return { commentId: d.id, type };
    })
  );

  const byCommentId = new Map(myReactions.map((r) => [r.commentId, r.type]));

  const comments: ForumComment[] = docs.flatMap((d) => {
    const data = d.data() as any;
    if (data?.moderationStatus === "HIDDEN") return [];

    const createdAt = data.createdAt?.toDate?.() ?? null;
    const updatedAt = data.updatedAt?.toDate?.() ?? null;
    const deletedAt = data.deletedAt?.toDate?.() ?? null;
    const userCommunityLevel = normalizeCommunityLevelId(data.userCommunityLevel);

    return [
      {
        id: d.id,
        lessonId: data.lessonId,
        courseId: data.courseId,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar ?? null,
        isAnonymous: !!data.isAnonymous,
        userCommunityLevel,
        content: data.content,
        createdAt,
        updatedAt,
        reactions: normalizeReactionCounts(data.reactions),
        myReaction: byCommentId.get(d.id) ?? null,
        isDeleted: !!data.isDeleted,
        deletedAt,
      },
    ];
  });

  const nextCursor = docs.length > 0 ? docs[docs.length - 1] : null;
  return { comments, cursor: nextCursor };
}
