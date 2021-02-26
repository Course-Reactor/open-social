import { FastifyInstance, FastifyReply } from "fastify";
import { MongoError } from "mongodb";
import { UserRequest, Users } from "../models/User";

export default async (server: FastifyInstance) => {
  server.post("/signup", createUser);
};

function createUser(
  this: FastifyInstance,
  request: UserRequest,
  reply: FastifyReply
) {
  const db = this.mongo.db!;
  const onCollection = (error: MongoError, users: Users) => {
    if (error)
      return reply
        .code(500)
        .send("An error ocurred while trying to register. Please try again.");

    users.insertOne(
      { name: request.body.name, display_name: request.body.display_name },
      (error, user) => reply.send(user.ops)
    );
  };

  db.collection("users", onCollection);
}
