Some of the workflow actions need a task-definition.json to talk to AWS ECS. That file should be included in the repo here, but if it needs to be regenerated, run the following in a shell with AWS CLI and node installed:

```sh
aws ecs describe-task-definition \
   --task-definition opportunity-prod-task \
   --query taskDefinition | \
   node removeKeys.js > task-definition.json
```
