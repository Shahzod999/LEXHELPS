import { saveTokenToSecureStore } from "@/utils/secureStore";
import { apiSlice } from "../apiSlice";
import { setToken } from "@/redux/features/tokenSlice";
import {
  LoginResponseType,
  ProfileResponseType,
  UpdateProfileType,
} from "@/types/login";
import { setUser } from "@/redux/features/userSlice";

interface LoginCredentials {
  email: string;
  password: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseType, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          dispatch(setToken(data.token));
          await saveTokenToSecureStore(data.token);
        } catch (error) {
          console.error("Error saving token:", error);
        }
      },
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setToken(data.token));
          await saveTokenToSecureStore(data.token);
        } catch (error) {
          console.error("Error saving token:", error);
        }
      },
    }),

    getProfile: builder.query<ProfileResponseType, void>({
      query: () => ({
        url: "/users/profile",
      }),
      providesTags: ["Profile"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    updateProfile: builder.mutation<ProfileResponseType, UpdateProfileType>({
      query: (credentials) => ({
        url: "/users",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteProfile: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = authApiSlice;
