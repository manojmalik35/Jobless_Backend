const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { ALGO, SK } = require("../configs/config");

const algorithm = ALGO;
const secretKey = SK;
const iv = crypto.randomBytes(16);//initialization vector

const encrypt = (text) => {


    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };

};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

const Email = async function(options){
    try{

        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "b6051c56c31e12",
              pass: "29ede9dcc220a8"
            }
          });

          const emailOptions = {
            from: '"Manoj" <admin@apple.com>', // sender address
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
          }

          await transport.sendMail(emailOptions);

    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    encrypt,
    decrypt,
    Email
};