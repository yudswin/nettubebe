import crypto from "crypto";

function getRandomBytes(size: number): Uint8Array {
    return new Uint8Array(crypto.randomBytes(size));
}

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateUUIDv2(name?: string, domain: number = 0, id: number = process.getuid?.() ?? 0): string {
    const newId = name ? stringToSingleDecimal(name) : id
    const offset: bigint = 0x01B21DD213814000n
    const now = BigInt(Date.now()) * 10000n + offset;

    const timeLow = Number(now & 0xFFFFFFFFn);
    const timeMid = Number((now >> 32n) & 0xFFFFn);
    const timeHiAndVersion = Number((now >> 48n) & 0x0FFFn) | (2 << 12); // version 2

    const clockSeq = getRandomBytes(2);
    clockSeq[0] = (clockSeq[0] & 0x3F) | 0x80; // variant bits

    const node = new Uint8Array(6);
    node[0] = domain;          // Domain (0: person, 1: group, etc.)
    node[1] = (newId >> 8) & 0xff;
    node[2] = newId & 0xff;
    const randomTail = getRandomBytes(3);
    node.set(randomTail, 3);

    return [
        timeLow.toString(16).padStart(8, '0'),
        timeMid.toString(16).padStart(4, '0'),
        timeHiAndVersion.toString(16).padStart(4, '0'),
        toHex(clockSeq).slice(0, 4),
        toHex(node)
    ].join('-');
}

function stringToSingleDecimal(str: string): number {
    const decimalString = Array.from(str)
        .map(char => char.charCodeAt(0).toString().padStart(3, '0')) // pad for safety
        .join('');
    return parseInt(decimalString)
}
