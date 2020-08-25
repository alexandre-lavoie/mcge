const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

console.log("MCGE Builder\n");

(async () => {
    if(fs.existsSync(path.resolve(__dirname, 'build'))) {
        console.log('> Removing Previous Build');
        fs.rmdirSync(path.resolve(__dirname, 'build'), { recursive: true });
    }

    console.log('> Building Game');

    let output = await exec('npm run nextBuild');

    console.log('> Exporting Game Pages');

    output = await exec('npm run nextExport');
    
    console.log('> Building Server');
    
    output = await exec('npm run expressBuild');
    
    console.log('> Moving Game to Server');

    await fs.move(path.resolve(__dirname, 'out'), path.resolve(__dirname, 'build/out'));
    
    console.log('> Done\n');
})();