import { start } from "shared/ecs";
import { Host } from "shared/hosts";
import { setEnvironment } from "shared/idAttribute";
import "shared/state/client";

const HOST = Host.Client;

setEnvironment(HOST);
start(HOST);
