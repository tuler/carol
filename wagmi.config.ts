import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
    out: "src/contracts.ts",
    contracts: [],
    plugins: [
        foundry({
            project: "node_modules/@cartesi/rollups",
            forge: {
                build: false,
                rebuild: false,
            },
        }),
    ],
});
