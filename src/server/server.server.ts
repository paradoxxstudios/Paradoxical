import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { setEnvironment } from "shared/idAttribute";

const HOST = Host.Server;

setEnvironment(HOST);
start(HOST);
