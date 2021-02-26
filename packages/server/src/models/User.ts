import { FastifyRequest } from "fastify";
import { Collection, ObjectID } from "mongodb";

export type User = {
  _id: ObjectID;
  name: string;
  display_name: string;
  bio?: string;
  profile_picture?: string;
};

export type Users = Collection<User>;

export type UserRequest = FastifyRequest<{
  Body: User;
}>;
