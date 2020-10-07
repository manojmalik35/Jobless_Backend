module.exports = {
    DB : process.env.DB_NAME,
    USER : process.env.DB_USER,
    PASS : process.env.DB_PASS,
    KEY : process.env.JWT_KEY,
    ALGO : process.env.CRYPTO_ALGO,
    SK : process.env.CRYPTO_KEY
}