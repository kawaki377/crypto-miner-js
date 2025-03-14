function sha256(ascii) {
    // Function to compute SHA-256 hash
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j; // Used as a counter across the whole file
    var result = '';

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    // Cache the encoded K constants
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};

    function getPrime(n) {
        for (var candidate = 2; primeCounter < n; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        return hash.slice(0, n);
    }

    ascii += '\x80'; // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'; // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // Σ1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // Ch
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // σ0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // σ1
                ) | 0);
            // This is only used once, so `temp1` can be overwritten
            hash = [(temp1 + ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // Σ0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])) // Maj
            ) | 0].concat(hash); // We can use `concat` because we know the length of `hash` at this point
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}

function mine(blockNumber, transactions, previousHash, prefixZeros) {
    let prefixStr = '0'.repeat(prefixZeros);
    let nonce = 0;
    while (true) {
        let text = blockNumber + transactions + previousHash + nonce;
        let newHash = sha256(text);
        if (newHash.startsWith(prefixStr)) {
            console.log(`Successfully mined block with nonce value: ${nonce}`);
            return newHash;
        }
        nonce++;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mineButton = document.getElementById('mineButton');
    mineButton.addEventListener('click', () => {
        const blockNumber = 1;
        const transactions = `
            Kawaki377 sends 2 BTC to Alice
            Alice sends 1 BTC to Bob
        `;
        const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
        const prefixZeros = 4;
        const startTime = Date.now();
        const newHash = mine(blockNumber, transactions, previousHash, prefixZeros);
        const totalTime = (Date.now() - startTime) / 1000;
        console.log(`Mining took: ${totalTime} seconds`);
        console.log(`New hash: ${newHash}`);
    });
});
