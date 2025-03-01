import { changeProfileImgRequest } from "@/api/api";
import { getUser } from "@/api/user.api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const userKey = 'user';

// 유저에 관한 데이터 다루는 메서드 모음
export const useUser = (jwt: string) => {
    const queryClient = useQueryClient();

    // 유저 정보를 불러오고 캐시에 저장 (전역적으로 사용 가능)
    const {data: user, isLoading: isUserLoading, error: userError, refetch: refetchUser} = useQuery({
        queryKey: [userKey],
        queryFn: () => {
            return getUser(jwt);
        },
        enabled: !!jwt,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30 // 30분
    });

    // 프로필 이미지 변경
    const changeProfileImage = (file: File) => {
        changeProfileImgRequest(jwt, file).then((result) => {
            if (!result) {
                window.alert('프로필 이미지 변경 실패! 다시 시도해주세요');
                return;
            }
            queryClient.invalidateQueries({
                queryKey: [userKey]
            });
        });
    }
    
    // 유저 캐시 무효화
    const invalidateUser = () => {
        queryClient.invalidateQueries({
            queryKey: [userKey]
        })
    }

    // 유저 쿼리 삭제
    const deleteUser = () => {
        queryClient.removeQueries({
            queryKey: [userKey]
        })
    }

    return {user, isUserLoading, userError, refetchUser, changeProfileImage, invalidateUser, deleteUser };
}