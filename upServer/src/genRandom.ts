const MAX_LEN = 5;

export function generate() {
    const subset = "1234567890qwertyuiopasdfghjklzxcvbnm";
    let id = "";
    for (let i=0; i<MAX_LEN; i++) {
        id += subset[Math.floor(Math.random() * subset.length)];
    }
    return id;
}