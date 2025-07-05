import { and, eq } from "ponder";
import type { Context } from "ponder:registry";
import { type epoch, output } from "ponder:schema";
import { keccak256 } from "viem";
import { SparseMerkleTree } from "./merkle";

const trees: Record<string, SparseMerkleTree> = {};

export const createProofs = async (
    context: Context,
    ep: typeof epoch.$inferSelect,
) => {
    // keep trees in memory, for each application
    const treeKey = `${ep.chainId}-${ep.applicationAddress}`;
    let tree = trees[treeKey];
    if (!tree) {
        tree = new SparseMerkleTree();
        trees[treeKey] = tree;
    }

    // get all outputs of the epoch being closed
    const outputs = await context.db.sql
        .select()
        .from(output)
        .where(
            and(
                eq(output.chainId, ep.chainId),
                eq(output.applicationAddress, ep.applicationAddress),
                eq(output.epochIndex, ep.index),
            ),
        );

    if (outputs.length === 0) {
        // no outputs in epoch, don't need to update anything
        return;
    }

    // check if all previous outputs are already in the tree
    if (tree.getLeafCount() !== outputs[0].index) {
        throw new Error("Merkle tree corrupted");
    }

    // add all outputs to tree
    for (const o of outputs) {
        tree.insertLeaf(keccak256(o.rawPayload));
    }

    // update all proofs
    for (const o of outputs) {
        const proof = tree.getProof(o.index);
        await context.db
            .update(output, {
                chainId: o.chainId,
                applicationAddress: o.applicationAddress,
                inputIndex: o.inputIndex,
                index: o.index,
            })
            .set({
                proof: proof.siblings,
            });
    }
};
