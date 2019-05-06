"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _configuration = _interopRequireDefault(require("../../../../setup/configuration"));

var _parseKeyValuePairSeparatedBySymbol = require("../utility/parseKeyValuePairSeparatedBySymbol.js");

const {
  execSync,
  spawn,
  spawnSync
} = require('child_process');

// targetApp
const applicationPath = _path.default.join(_configuration.default.directory.projectPath, 'application');

const appDeploymentLifecycle = _path.default.join(applicationPath, 'dependency/appDeploymentLifecycle');

console.group('• Running entrypoint application in Manager Container:');
console.log(`- passed process arguments: ${JSON.stringify(process.argv)}`);
const namedArgs = (0, _parseKeyValuePairSeparatedBySymbol.parseKeyValuePairSeparatedBySymbolFromArray)({
  array: process.argv
}); // ['x=y'] --> { x: y }
// ../utility/parseKeyValuePairSeparatedBySymbol.js is needed for 'imageName' argument.

let nodeModuleFolder = `${appDeploymentLifecycle}/entrypoint/build`;

if (!_fs.default.existsSync(`${nodeModuleFolder}/node_modules`)) {
  spawnSync('yarn', [`install`], {
    cwd: nodeModuleFolder,
    shell: true,
    stdio: [0, 1, 2]
  });
}
/*
 * Usage:
 * • ./entrypoint.sh build dockerImage imageName=<application image name>
 * • ./entrypoint.sh build debug
 * • ./entrypoint.sh build task=<a gulpTask> // e.g. ./setup/entrypoint.sh build task=nativeClientSide:html:metadata
 */


let ymlFile = `${appDeploymentLifecycle}/deploymentContainer/deployment.dockerCompose.yml`;
let containerPrefix = 'app_build';

switch (process.argv[0]) {
  // TODO: separate buildSourceCode from buildContainerImage
  // TODO: implement image build - example implementation in appDeploymentEnvironment -> entrypoint "buildEnvironmentImage.js"
  case 'containerImage':
    {
      let serviceName = 'buildImage';
      let environmentVariable = {
        SZN_DEBUG: false,
        hostPath: process.env.hostPath,
        imageName: namedArgs.imageName || process.env.imageName || _configuration.default.dockerImageName
      };
      let processCommand = 'docker-compose',
          processCommandArgs = [`-f ${ymlFile}`, `--project-name ${containerPrefix}`, `build --no-cache ${serviceName}`],
          processOption = {
        // cwd: `${applicationPath}`,
        shell: true,
        stdio: [0, 1, 2],
        env: environmentVariable
      };
      spawnSync(processCommand, processCommandArgs, processOption);
    }
    break;

  case 'sourceCode':
  default:
    {
      let serviceName = 'nodejs';
      let debugCommand = process.argv.includes('debug') ? `--inspect${process.argv.includes('break') ? '-brk' : ''}=0.0.0.0:9229` : '';
      let gulpTask = namedArgs.task || 'build';
      let appEntrypointPath = `${appDeploymentLifecycle}/entrypoint/build/`;
      let containerCommand = `node ${debugCommand} ${appEntrypointPath} ${gulpTask}`;
      let environmentVariable = {
        DEPLOYMENT: 'development',
        SZN_DEBUG: false,
        hostPath: process.env.hostPath,
        imageName: namedArgs.imageName || process.env.imageName || _configuration.default.dockerImageName
      };
      let processCommand = 'docker-compose',
          processCommandArgs = [`-f ${ymlFile}`, `--project-name ${containerPrefix}`, `run --service-ports --use-aliases`, `--entrypoint '${containerCommand}'`, `${serviceName}`],
          processOption = {
        // cwd: `${applicationPath}`,
        shell: true,
        stdio: [0, 1, 2],
        env: environmentVariable
      };
      spawnSync(processCommand, processCommandArgs, processOption);
    }
    break;
}