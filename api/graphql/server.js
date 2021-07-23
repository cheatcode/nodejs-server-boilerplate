import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import { isDevelopment } from "../../.app/environment";
import loginWithToken from "../users/token";
import { configuration as corsConfiguration } from "../../middleware/cors";

export default async (app) => {
  const server = new ApolloServer({
    schema,
    introspection: isDevelopment,
    playground: isDevelopment,
    context: async ({ req, res }) => {
      const token = req?.cookies["app_login_token"];

      const context = {
        req,
        res,
        user: {},
      };

      const user = token ? await loginWithToken({ token }) : null;

      if (!user?.error) {
        context.user = user;
      }

      return context;
    },
  });

  await server.start();

  server.applyMiddleware({
    cors: corsConfiguration,
    app,
    path: "/api/graphql",
  });
};
