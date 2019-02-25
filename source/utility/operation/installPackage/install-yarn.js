

import childProcess from 'child_process'

export default ({ yarnPath }) => async ()=> {
		// In gulp 4, you can return a child process to signal task completion
		return childProcess.execSync('yarn install -y;', { cwd: yarnPath, shell: true, stdio:[0,1,2] });
}