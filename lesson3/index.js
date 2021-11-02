const fs = require('fs');
const { gzip } = require('zlib');

const searchStrings = ['89.123.1.41', '34.48.240.111'];
const readStream = new fs.createReadStream('./access.log', 'utf8');

searchStrings.forEach((searchString)=>{
    const writeStream = new fs.createWriteStream(`./${searchString}_requests.log`)

    const {
        Transform
    } = require('stream');
    
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            const transformedChunk = chunk
                .toString()
                .split("\n")
                .filter((str) => str.includes(searchString))
                .join("\n");
    
            this.push(transformedChunk);
    
            callback();
        }
    });
    
    // readStream.pipe(transformStream).pipe(process.stdout);
    readStream.pipe(transformStream).pipe(writeStream);
})

