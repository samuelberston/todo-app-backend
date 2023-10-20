const vault = require("node-vault")();

const name = "demo-key";

const encode = (input) => {
    if (input)
      return Buffer.from(input).toString('base64');
}

const decode = (input) => {
    if (input)
      return Buffer.from(input, 'base64').toString('utf8');
}

const vault_encrypt = async (plaintextValue) => {
  const encryptResponse = await vault.write(`transit/encrypt/${name}`, { plaintext: encode(plaintextValue) });
  return encryptResponse.data.ciphertext;
};

const vault_encrypt_all = async (plaintextValues) => {
  for (let i = 0; i < plaintextValues.length; i++) {
    const encryptedValue = await vault_encrypt(plaintextValues[i]);
    plaintextValues[i] = encryptedValue;
  }
  return plaintextValues;
};

const vault_decrypt = async (ciphertext) => {
  const decryptResponse = await vault.write(`transit/decrypt/${name}`, { ciphertext: ciphertext });
  return decode(decryptResponse.data.plaintext);
}

const vault_decrypt_all = async (ciphertextValues) => {
  console.log('decrypting..')
  console.log(ciphertextValues)
  ciphertextValues.forEach(row => {
    for (let i = 0; i < Object.keys(row).length; i++) {
      const key = Object.keys(row)[i];
      vault_decrypt(row[key])
        .then(decryptedValue =>
          row[key] = decryptedValue
        )
    }
  })

  return ciphertextValues;
}

module.exports = {
  vault_encrypt,
  vault_encrypt_all,
  vault_decrypt,
  vault_decrypt_all
}