import { useQuery } from "@tanstack/react-query";
import { collection, getDocsFromCache, getDocsFromServer } from "firebase/firestore";

import { useAuthStore } from "@/stores/authStore";
import { db } from "@/configs/firebase/firebase";
import { IUserCourseProgress } from "@/types/course";

export function useAllCoursesProgress() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["allCoursesProgress", user?.uid],
    queryFn: async (): Promise<Record<string, IUserCourseProgress>> => {
      if (!user?.uid) return {};

      const progressRef = collection(db, "users", user.uid, "courseProgress");
      let snapshot;

      try {
        const cacheSnapshot = await getDocsFromCache(progressRef);
        if (!cacheSnapshot.empty) {
          snapshot = cacheSnapshot;
        } else {
          snapshot = await getDocsFromServer(progressRef);
        }
      } catch {
        snapshot = await getDocsFromServer(progressRef);
      }

      const progressMap: Record<string, IUserCourseProgress> = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const item = {
          ...data,
          startedAt: data.startedAt?.toDate(),
          lastAccessedAt: data.lastAccessedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          certificateIssuedAt: data.certificateIssuedAt?.toDate(),
        } as IUserCourseProgress;

        if (docSnap.id) progressMap[docSnap.id] = item;
        if (data.courseId) progressMap[data.courseId] = item;
      });

      return progressMap;
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (invalidação manual nas modificações)
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 dias
    refetchOnMount: false,
  });
}
