// Removes unwanted keys from AWS ECS task definitions.
// aws-actions/amazon-ecs-deploy-task-definition@v1 fills GitHub Action logs
// with warnings if these keys are present.
//
// Usage: cat task-definition | node removeKeys.js

var fs = require("fs");
var stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
var data = JSON.parse(stdinBuffer)
const blacklist = [
    'compatibilities',
    'taskDefinitionArn',
    'requiresAttributes',
    'revision',
    'status',
    'registeredAt',
    'registeredBy'
    ]
blacklist.forEach((key) => { delete data[key] })
console.log(JSON.stringify(data, null, 4))
