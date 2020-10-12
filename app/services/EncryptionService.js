const bcrypt = require('bcryptjs');

const salt = 8;

module.exports.encrypt = (data) => {
    return bcrypt.hashSync(data, salt);
}

module.exports.compareData = async (data, dataToCompare) => {
    let cmpResult;

    await bcrypt.compare(data, dataToCompare).then((result) => {
        cmpResult = result;
    })

    return cmpResult;
}