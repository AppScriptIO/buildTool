const path = require('path')
const confJson = require('./configuration/configuration.js')
const moduleSystem = require('module')
const filesystem = require('fs')
const { execSync, spawn, spawnSync } = require('child_process')

// Run babel runtime compiler
const gulpBuildToolFolder = path.normalize(`${confJson.directory.appDeploymentLifecyclePath}/gulp_buildTool.js/`)
function installModule({ currentDirectory }) { spawnSync('yarn', ["install --pure-lockfile --production=false"], { cwd: currentDirectory, shell: true, stdio:[0,1,2] }) }
{
    let directory = gulpBuildToolFolder
    let isNodeModuleExist = filesystem.existsSync(`${directory}/node_modules`)
    if (!isNodeModuleExist) {
        installModule({ currentDirectory: directory })
        // spawnSync('yarn', ["upgrade appscript"], { cwd: directory, shell: true, stdio:[0,1,2] });
    }
}

// run app code
require('./gulpfile.js')