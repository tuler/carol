import { concat, type Hash, keccak256, zeroHash } from "viem";

export interface MerkleProof {
    leaf: Hash;
    index: bigint;
    siblings: Hash[];
}

export class SparseMerkleTree {
    private readonly height: number;
    private readonly zeroHashes: Hash[];
    private nodes: Map<number, Map<bigint, Hash>>;
    private nextLeafIndex: bigint;

    constructor(height: number = 63) {
        if (height <= 0 || height > 63) {
            throw new Error("Height must be between 1 and 63");
        }

        this.height = height;
        this.nodes = new Map();
        this.nextLeafIndex = 0n;
        this.zeroHashes = this.computeZeroHashes(height);
    }

    /**
     * Pre-compute zero hashes for each level of the tree
     */
    private computeZeroHashes(height: number): Hash[] {
        const zeroHashes: Hash[] = new Array(height + 1);

        // Level 0 (leaves): zero hash (32 bytes of zeros)
        zeroHashes[0] = zeroHash;

        // Each subsequent level: hash of two zero hashes from the level below
        for (let i = 1; i <= height; i++) {
            zeroHashes[i] = keccak256(
                concat([zeroHashes[i - 1], zeroHashes[i - 1]]),
            );
        }

        return zeroHashes;
    }

    /**
     * Get the hash value for a node, returning zero hash if not stored
     */
    private getNodeHash(level: number, index: bigint): Hash {
        const levelMap = this.nodes.get(level);
        if (!levelMap) {
            return this.zeroHashes[level];
        }
        return levelMap.get(index) || this.zeroHashes[level];
    }

    /**
     * Set the hash value for a node
     */
    private setNodeHash(level: number, index: bigint, hash: Hash): void {
        // Only store non-zero hashes to save memory
        if (hash !== this.zeroHashes[level]) {
            let levelMap = this.nodes.get(level);
            if (!levelMap) {
                levelMap = new Map();
                this.nodes.set(level, levelMap);
            }
            levelMap.set(index, hash);
        } else {
            // Remove if it exists and is now zero
            const levelMap = this.nodes.get(level);
            if (levelMap) {
                levelMap.delete(index);
                if (levelMap.size === 0) {
                    this.nodes.delete(level);
                }
            }
        }
    }

    /**
     * Insert a new leaf at the next available position
     */
    insertLeaf(leafHash: Hash): bigint {
        const leafIndex = this.nextLeafIndex;

        if (leafIndex >= 1n << BigInt(this.height)) {
            throw new Error("Tree is full");
        }

        // Set the leaf
        this.setNodeHash(0, leafIndex, leafHash);

        // Update the path from leaf to root
        this.updatePath(leafIndex);

        this.nextLeafIndex++;
        return leafIndex;
    }

    /**
     * Update all nodes along the path from a leaf to the root
     */
    private updatePath(leafIndex: bigint): void {
        let currentIndex = leafIndex;

        for (let level = 0; level < this.height; level++) {
            const siblingIndex = currentIndex ^ 1n; // XOR with 1 to get sibling
            const parentIndex = currentIndex >> 1n; // Divide by 2 to get parent

            const leftHash = this.getNodeHash(
                level,
                currentIndex < siblingIndex ? currentIndex : siblingIndex,
            );
            const rightHash = this.getNodeHash(
                level,
                currentIndex < siblingIndex ? siblingIndex : currentIndex,
            );

            const parentHash = keccak256(concat([leftHash, rightHash]));
            this.setNodeHash(level + 1, parentIndex, parentHash);

            currentIndex = parentIndex;
        }
    }

    /**
     * Get the root hash of the tree
     */
    getRootHash(): Hash {
        return this.getNodeHash(this.height, 0n);
    }

    /**
     * Generate a Merkle proof for a leaf at the given index
     */
    getProof(leafIndex: bigint): MerkleProof {
        if (leafIndex >= this.nextLeafIndex) {
            throw new Error("Leaf index out of bounds");
        }

        const leaf = this.getNodeHash(0, leafIndex);
        const siblings: Hash[] = [];
        let currentIndex = leafIndex;

        for (let level = 0; level < this.height; level++) {
            const siblingIndex = currentIndex ^ 1n;
            const siblingHash = this.getNodeHash(level, siblingIndex);
            siblings.push(siblingHash);
            currentIndex = currentIndex >> 1n;
        }

        return {
            leaf,
            index: leafIndex,
            siblings,
        };
    }

    /**
     * Verify a Merkle proof against the current root
     */
    verifyProof(proof: MerkleProof): boolean {
        const computedRoot = this.computeRootFromProof(proof);
        return computedRoot === this.getRootHash();
    }

    /**
     * Compute the root hash from a proof without comparing to stored root
     */
    computeRootFromProof(proof: MerkleProof): Hash {
        if (proof.siblings.length !== this.height) {
            throw new Error(
                `Invalid proof: expected ${this.height} siblings, got ${proof.siblings.length}`,
            );
        }

        let currentHash = proof.leaf;
        let currentIndex = proof.index;

        for (let i = 0; i < this.height; i++) {
            const sibling = proof.siblings[i];
            const isLeft = (currentIndex & 1n) === 0n;

            if (isLeft) {
                currentHash = keccak256(concat([currentHash, sibling]));
            } else {
                currentHash = keccak256(concat([sibling, currentHash]));
            }

            currentIndex = currentIndex >> 1n;
        }

        return currentHash;
    }

    /**
     * Get the current number of leaves in the tree
     */
    getLeafCount(): bigint {
        return this.nextLeafIndex;
    }

    /**
     * Get the maximum number of leaves the tree can hold
     */
    getMaxLeafCount(): bigint {
        return 1n << BigInt(this.height);
    }

    /**
     * Get memory usage statistics
     */
    getMemoryStats(): { storedNodes: number; totalPossibleNodes: bigint } {
        let storedNodes = 0;
        for (const levelMap of this.nodes.values()) {
            storedNodes += levelMap.size;
        }

        const totalPossibleNodes = (1n << BigInt(this.height + 1)) - 1n;
        return {
            storedNodes,
            totalPossibleNodes,
        };
    }

    /**
     * Get a leaf hash by index
     */
    getLeaf(index: bigint): Hash {
        if (index >= this.nextLeafIndex) {
            throw new Error("Leaf index out of bounds");
        }
        return this.getNodeHash(0, index);
    }

    /**
     * Check if a leaf exists at the given index
     */
    hasLeaf(index: bigint): boolean {
        return index < this.nextLeafIndex;
    }
}
