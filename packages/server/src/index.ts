import os from "os";
import path from "path";
import cluster from "cluster";
import dotenv from "dotenv";
import server from "./server";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const APP_PORT = process.env.APP_PORT ?? "8080";
let workers: Array<cluster.Worker> = [];

const setupWorkerProcesses = () => {
  let cores = os.cpus().length;
  console.log(`Main cluster setting up ${cores} ${workers} workers`);

  for (let i = 0; i < cores; i++) {
    workers.push(cluster.fork());

    workers[i].on("message", (message) => console.log(message));
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is listening`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    console.log("Starting a new worker");
    cluster.fork();
    workers.push(cluster.fork());
    workers[workers.length - 1].on("message", (message) =>
      console.log(message)
    );
  });
};

const setupFastify = () => {
  server.listen(APP_PORT, (error: Error, address: string) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }

    server.log.info(`Server listening on ${address}`);
  });
};

const setupServer = (clusterRequired: boolean) => {
  if (clusterRequired && cluster.isMaster) setupWorkerProcesses();
  else setupFastify();
};

setupServer(true);
