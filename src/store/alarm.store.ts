import { request } from "@/api/template";
import { toast } from "@/hooks/use-toast";
import { Alarm } from "@/types/item";
import { DOMAIN } from "@/utils/env";
import { create } from "zustand";

type MessageType = {
    eventSource: EventSource | null;
    messages: Alarm[];
    isEnd: boolean;
    subscribe: () => void;
    unsubscribe: () => void;
    initMessages: () => void;
    setMoreMessages: (messages: Alarm[]) => void;
    setIsEnd: (isEnd: boolean) => void;
    postAlarm: (reviewId: number, fromUsername: string) => void;
}

const messageStore = create<MessageType>((set, get) => ({
    eventSource: null,
    messages: [],
    isEnd: false,
    subscribe: () => {
        const eventSource = new EventSource(DOMAIN + "/sse/subscribe", {withCredentials: true});
        
        eventSource.addEventListener("connect", (event) => {
            console.log(event.data);
        });

        eventSource.addEventListener("like", (event) => {
            const data = event.data;
            console.log(data);
            toast({
                title: "좋아요 알림",
                description: data,})
        });

        eventSource.addEventListener("error", (event) => {
            console.error("Error occurred:", event);
            eventSource.close();
        });

        set(() => ({
            eventSource: eventSource,
        }));
    },
    unsubscribe: () => {
        // 서버에 연결 종료 요청하여 서버에 저장된 emitter 삭제
        request.post('/sse/unsubscribe', null)
            .then(() => {
                console.log('[SSE] 서버에 연결 종료 요청 성공');
                get().eventSource?.close();
        })
            .catch((err) => {
                console.error('[SSE] 서버 연결 종료 요청 실패', err);
                get().eventSource?.close();
            }
        );
    },
    setMoreMessages: (messages: Alarm[]) => {
        set((state) => ({
            messages: [...state.messages, ...messages],
        }));
    },
    initMessages: () => {
        set(() => ({
            messages: [],
        }));
    },
    setIsEnd: (isEnd: boolean) => {
        set(() => ({
            isEnd: isEnd,
        }));
    },
    postAlarm: async (reviewId: number, fromUsername: string) => {
        await request.post<{reviewId: number, fromUsername: string}>(DOMAIN + "/sse/like", {
            reviewId: reviewId,
            fromUsername: fromUsername,});
    },
}));

export const useMessages = () => messageStore((state) => state.messages);
export const useIsEnd = () => messageStore((state) => state.isEnd);
export const useSubscribe = () => messageStore((state) => state.subscribe);
export const useUnsubscribe = () => messageStore((state) => state.unsubscribe);
export const useInitMessages = () => messageStore((state) => state.initMessages);
export const useSetMoreMessages = () => messageStore((state) => state.setMoreMessages);
export const useSetIsEnd = () => messageStore((state) => state.setIsEnd);
export const usePostAlarm = () => messageStore((state) => state.postAlarm);