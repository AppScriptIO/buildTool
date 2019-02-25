import filesystem from 'fs';
import childProcess from 'child_process'
import path from 'path'

export default ({ nodejsVersion, jspmLocation }) => async () => {

	// In gulp 4, you can return a child process to signal task completion
	// var process = childProcess.execSync('n stable; jspm install; n ' + nodejsVersion, { cwd: jspmLocation, shell: true, stdio:[0,1,2] });
	let packageJson = require(path.join(jspmLocation, 'package.json'))
	let packageFolder;
	if(packageJson.jspm.directories.packages) {
		packageFolder = path.join(jspmLocation, packageJson.jspm.directories.packages)
	} else {
		packageFolder = path.join(jspmLocation, 'jspm_packages')
	}
	
	if(! filesystem.existsSync(packageFolder)) {
		var process = childProcess.execSync('jspm install', { cwd: jspmLocation, shell: true, stdio:[0,1,2] });
		return await process;
	} else {
		console.log('Skipping JSPM, as package folder already exist.')
		return
	}

}