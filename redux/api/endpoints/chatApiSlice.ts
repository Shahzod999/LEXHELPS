import { ChatHistoryType, ChatResponseType } from "@/types/chat";
import { apiSlice } from "../apiSlice";

interface Message {
  chatId?: string;
  content: string;
}

interface DeleteChatResponse {
  message: string;
  nextChatId: string;
}

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserChats: builder.query<ChatHistoryType[], void>({
      query: () => ({
        url: "/chat",
      }),
      providesTags: ["Chat"],
    }),
    getUserOneChat: builder.query<ChatHistoryType, string | void>({
      query: (chatId) => ({
        url: `/chat/single/${chatId}`,
      }),
      providesTags: ["Chat"],
    }),

    sendMessage: builder.mutation<ChatResponseType, Message>({
      query: (message) => ({
        url: "/chat",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation<DeleteChatResponse, string>({
      query: (chatId) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    createNewChat: builder.mutation<ChatHistoryType, void>({
      query: () => ({
        url: "/chat/create",
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useGetUserOneChatQuery,
  useSendMessageMutation,
  useDeleteChatMutation,
  useCreateNewChatMutation,
} = chatApiSlice;
