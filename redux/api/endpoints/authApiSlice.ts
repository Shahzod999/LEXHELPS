import i18n from "@/i18";
import { setToken } from "@/redux/features/tokenSlice";
import { setUser } from "@/redux/features/userSlice";
import { LoginResponseType, ProfileResponseType, UpdateProfileType } from "@/types/login";
import { saveTokenToSecureStore } from "@/utils/secureStore";
import { apiSlice } from "../apiSlice";

interface LoginCredentials {
  email: string;
  password: string;
}

interface GoogleAuthCredentials {
  accessToken: string;
}

interface AppleAuthCredentials {
  identityToken: string;
  authorizationCode: string;
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
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

    googleAuth: builder.mutation<LoginResponseType, GoogleAuthCredentials>({
      query: (credentials) => ({
        url: "/users/google-auth",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Google auth success:", data);

          dispatch(setToken(data.token));
          await saveTokenToSecureStore(data.token);
        } catch (error) {
          console.error("Error saving Google auth token:", error);
        }
      },
    }),

    appleAuth: builder.mutation<LoginResponseType, AppleAuthCredentials>({
      query: (credentials) => ({
        url: "/users/apple-auth",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Apple auth success:", data);

          dispatch(setToken(data.token));
          await saveTokenToSecureStore(data.token);
        } catch (error) {
          console.error("Error saving Apple auth token:", error);
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
          i18n.changeLanguage(data.data.user.language);
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
      query: (profileId) => ({
        url: `/users/${profileId}`,
        method: "DELETE",
      }),
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (credentials) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (credentials) => ({
        url: "/users/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useAppleAuthMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
