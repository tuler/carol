import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { graphql } from "ponder";
import { type config, db } from "ponder:api";
import schema from "ponder:schema";
import { handleRpc } from "typed-rpc/server";

import { getApplication, listApplications } from "./application";
import { getEpoch, listEpochs } from "./epoch";
import { getInput, listInputs } from "./input";
import { getOutput, listOutputs } from "./output";
import { jsonRpcRequestSchema } from "./rcp-types";
import { getReport, listReports } from "./report";

const app = new Hono();

export const DEFAULT_LIMIT = 10000;
export const DEFAULT_OFFSET = 0;

const service = (chainId: number) => ({
    cartesi_listApplications: listApplications(chainId),
    cartesi_getApplication: getApplication(chainId),
    cartesi_listEpochs: listEpochs(chainId),
    cartesi_getEpoch: getEpoch(chainId),
    cartesi_listInputs: listInputs(chainId),
    cartesi_getInput: getInput(chainId),
    cartesi_listOutputs: listOutputs(chainId),
    cartesi_getOutput: getOutput(chainId),
    cartesi_listReports: listReports(chainId),
    cartesi_getReport: getReport(chainId),
});

type Chain = keyof config["default"]["chains"];

const services = {
    mainnet: service(1),
    sepolia: service(11155111),
};

app.post("/:chain/rpc", zValidator("json", jsonRpcRequestSchema), async (c) => {
    const chain = c.req.param("chain") as Chain;
    const service = services[chain];
    if (!service) {
        return c.json({ error: "Invalid chain" }, 404);
    }
    const body = c.req.valid("json");
    const result = await handleRpc(body, services[chain]);
    return c.json(result);
});

app.use("/graphql", graphql({ db, schema }));

export default app;
