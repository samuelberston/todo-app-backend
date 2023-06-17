var vault = require("node-vault")();

const plainTextValue = 'super-secret-text';
const vaultKey = 'demo-key';

const encode = (input) => {
    return Buffer.from(input).toString('base64');
}

const decode = (input) => {
    return Buffer.from(input, 'base64').toString('utf8');
}

vault.write('transit/encrypt/demo-key', { plaintext: encode(plainTextValue) })
    .then(encryptResponse =>
        vault.write('transit/decrypt/demo-key', { ciphertext: encryptResponse.data.ciphertext } )
    ).then(decryptResponse => {
        console.log(decode(decryptResponse.data.plaintext))
    })