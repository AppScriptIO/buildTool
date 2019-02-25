

import childProcess from 'child_process'

export default ({ npmLocation }) => async () => {
	// In gulp 4, you can return a child process to signal task completion
	try {
		childProcess.spawnSync('yarn',
		['install --pure-lockfile --production=false;'], { cwd: npmLocation, shell: true, stdio:[0,1,2] });
	} catch (error) {
		console.log('• ERROR - childprocess error.')
		console.log(error)
		process.exit(1)
	}
}