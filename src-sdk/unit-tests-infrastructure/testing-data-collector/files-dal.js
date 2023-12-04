
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const jsonfile = require('jsonfile')

const filesDal = (() => {

    const _removeFolder = (done) => {
        rimraf(`./unit-tests-infrastructure/server-data`, (err) => {
            if (err) {
                console.log('_removeFolder error');
                console.log(err);
            }
            done();
        });
    }

    const _createFolder = (done) => {
        mkdirp(`./unit-tests-infrastructure/server-data`, (err) => {
            if (err) {
                console.log('_createFolder error');
                console.log(err);
            }
            done();
        });
    }

    const cleanServerDataFolder = (done) => {
        _removeFolder(() => {
            _createFolder(done);
        });
    }

    const saveTestCase = (json, kind, ready) => {
        var file = `./unit-tests-infrastructure/mocha-test-cases/${kind}.json`;

        jsonfile.writeFile(file, json, { spaces: 2 }, function (err) {

            if (!err) {
                ready(`Saved to: ${file}`);
            } else {
                console.log('saveTestCase error');
                console.error(err);
            }

        })
    }

    const saveJsonToFile = (json, fileName, ready) => {
        var file = `./unit-tests-infrastructure/server-data/${fileName}.json`;

        jsonfile.writeFile(file, json, { spaces: 2 }, function (err) {

            if (!err) {
                ready(`Saved to: ${file}`);
            } else {
                console.log('saveJsonToFile error');
                console.error(err);
            }

        })
    }

    return {
        cleanServerDataFolder,
        saveJsonToFile,
        saveTestCase
    }

})()

module.exports = filesDal;