import { request } from "@/api/template";
import { Alarm } from "@/types/item";
import { DOMAIN } from "@/utils/env";
import { useQuery } from "@tanstack/react-query";

type UseAlarmListQueryParams = {
  page: number;
  size: number;
}

interface UseAlarmListQueryReturn {
    notifications: Alarm[] | undefined;
    isEnd: boolean;
    isError: boolean;
    isPending: boolean;
    refetch: () => void;
}

type AlarmResponse = {
  notifications: Alarm[];
  isEnd : boolean;
}
  
type UseAlarmListQuery = (params: UseAlarmListQueryParams) => UseAlarmListQueryReturn;
  
export const useAlarmListQuery : UseAlarmListQuery= (params) => {
  const { page, size } = params;
  const { data, isError, isPending, refetch } = useQuery({
    queryKey: ['alarmList'],
    queryFn: () => {
      return request.get<AlarmResponse>(DOMAIN + '/sse/notifications/unread?page=' + page + '&size=' + size);
    },
    enabled: false,
  });

  const notifications = data?.notifications;
  const isEnd = data?.isEnd || false;
  
  return { notifications, isEnd, isError, isPending, refetch };
}