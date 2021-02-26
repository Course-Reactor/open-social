import fastify from "fastify";
import FastifyMongo from "fastify-mongodb";
import router from "./router";

const server = fastify({
  logger: true,
});

server.register(FastifyMongo, {
  forceClose: true,
  url: process.env.DATABASE_URL,
});
server.register(router);

export default server;
