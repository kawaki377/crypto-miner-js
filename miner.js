function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

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

    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return;
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];

            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                + ((e & hash[5]) ^ ((~e) & hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                ) | 0);
            hash = [(temp1 + ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))
            ) | 0)].concat(hash);
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
        if (nonce % 1000000 === 0) {
            console.log(`Current nonce: ${nonce}, Current hash: ${newHash}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const mineButton = document.getElementById('mineButton');
    const output = document.getElementById('output');
    mineButton.addEventListener('click', () => {
        const blockNumber = 1;
        const transactions = `
            Kawaki377 sends 2 BTC to Alice
            Alice sends 1 BTC to Bob
        `;
        const previousHash = "0000000000000000000000000000000000000000000000000000000000000000";
        const prefixZeros = 8; // Further increase the difficulty
        const startTime = Date.now();
        console.log(`Starting mining with difficulty: ${prefixZeros}`);
        const newHash = mine(blockNumber, transactions, previousHash, prefixZeros);
        const totalTime = (Date.now() - startTime) / 1000;
        output.textContent = `Mining took: ${totalTime} seconds\nNew hash: ${newHash}`;
    });
});
