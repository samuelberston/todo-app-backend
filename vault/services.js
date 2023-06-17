const vault = require("node-vault")();

const name = "demo-key";

const encode = (input) => {
    return Buffer.from(input).toString('base64');
}

const decode = (input) => {
    return Buffer.from(input, 'base64').toString('utf8');
}

const vault_encrypt = async (plaintextValue) => {
  const encryptResponse = await vault.write(`transit/encrypt/${name}`, { plaintext: encode(plaintextValue) });
  return encryptResponse.data.ciphertext;
};

const vault_decrypt = async (ciphertext) => {
  const decryptResponse = await vault.write(`transit/decrypt/${name}`, { ciphertext: ciphertext });
  return decode(decryptResponse.data.plaintext);
}

//Promise.resolve()
//  .then(() =>
//    vault_encrypt('Hello World!')
//  )
//  .then(encryptResponse =>
//    vault_decrypt(encryptResponse)
//  ).then(decryptResponse =>
//    console.log(decryptResponse)
//  )

module.exports = {
  vault_encrypt,
  vault_decrypt
}