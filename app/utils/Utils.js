const stream = require('stream');

module.exports.getImageType = (image) => {
    return image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
}

module.exports.passImageToStream = (image) => {
    const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

    const bufferStream = new stream.PassThrough();
    bufferStream.end(imageBuffer);

    return bufferStream;
}
