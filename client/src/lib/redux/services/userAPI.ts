import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IUser } from "../features/authSlice";

type ILogin = {
  email: string;
  password: string;
};

type IUser = {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  _id: string;
  playlist?: object[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type IRegister = {
  success: boolean;
  message: string;
  user: IUser;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/v1" }),
  tagTypes: ["Users", "Regi"],
  endpoints: (builder) => ({
    login: builder.mutation<ILogin, { email: string; password: string }>({
      query(data) {
        return {
          url: "login",
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: data,
        };
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }],
      transformResponse: (response: { data: ILogin }) => response.data,
    }),
    register: builder.mutation<IRegister, FormData>({
      query(data) {
        return {
          url: "/register",
          method: "POST",
          body: data,
        };
      },
    //   invalidatesTags: [{ type: "Users", id: "LIST" }],
    //   transformResponse: (response: { data: { user: IUser } }) =>
    //     response.data.user,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = userApi;
