import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query } from "firebase/firestore";

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
      const snapshot = await getDocs(progressRef);

      const progressMap: Record<string, IUserCourseProgress> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        progressMap[data.courseId] = {
          ...data,
          startedAt: data.startedAt?.toDate(),
          lastAccessedAt: data.lastAccessedAt?.toDate(),
          completedAt: data.completedAt?.toDate(),
          certificateIssuedAt: data.certificateIssuedAt?.toDate(),
        } as IUserCourseProgress;
      });

      return progressMap;
    },
    enabled: !!user?.uid,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
}
