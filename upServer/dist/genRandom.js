"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const MAX_LEN = 5;
function generate() {
    const subset = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let id = "";
    for (let i = 0; i < MAX_LEN; i++) {
        id += subset[Math.floor(Math.random() * subset.length)];
    }
    return id;
}
exports.generate = generate;
