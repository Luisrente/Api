const crypto = require('crypto');

const decryptString = ( qr ) => {
  const key = Buffer.from( process.env.KEYSTRING , 'utf8');
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(qr, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
 
}

module.exports = {
    decryptString
}
