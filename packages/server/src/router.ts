import { FastifyInstance } from "fastify";
import UserController from "./controllers/UserController";

export default async (server: FastifyInstance) => {
  server.register(UserController, { prefix: "/user" });
};
