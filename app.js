'use strict';
const fs = require('fs');
const yaml = require('js-yaml');
const doc = yaml.safeLoad(fs.readFileSync('profiles.yaml', 'utf8'));
const program = require('commander')
    .version('1.0.0')
    .option('-p, --profile [profile]', 'Add profile')
    .parse(process.argv);
let profile = program.profile;
if(!profile) {
    console.error("No profile specified, using default");
    profile = "default";
}
console.log(program.profile);
const profileObject = doc.profiles[profile];
const props = processArgs(profileObject);

processMaven(profileObject.args, props, doc.path);
function processMaven(args, properties, path) {
    const mvn = require('maven').create({
        cwd: path
    });
    if(!properties) {
        console.error("No such profile defined " + profile);
        return;
    }

    mvn.execute(args, properties).then(() => {
        console.log("Success");
    });

}

function processArgs(profile) {
    let args = profile.properties;
    if(profile != 'default') {
        args['profile'] = profile;
    }
    return args;
}

