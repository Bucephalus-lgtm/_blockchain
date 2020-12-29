const hexToBinary = require('hex-to-binary');
const crypto = require('crypto');
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    //  We make sure to stringify all the inputs 
    // because one of these inputs can be an object even if the object's properties changed.
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));
    return hash.digest('hex');
};

module.exports = cryptoHash;