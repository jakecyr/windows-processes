const { exec } = require('child_process');
const execPromise = require('util').promisify(exec);

/**
 * Get a list of all running processes.
 * @returns {Promise<string[]}
 */
const getProcessNameList = async () => {
  const { stdout } = await execPromise('tasklist');

  return stdout
    .split('\n')
    .slice(3)
    .filter((row) => row.trim())
    .map((row) => row.split(/\s+/g)[0]);
};

/**
 * Get an object of all running processes with key as process name and value as process id.
 * @returns {Promise<string[]>}
 */
const getProcessMap = async () => {
  const { stdout } = await execPromise('tasklist');

  const processMap = {};

  stdout
    .split('\n')
    .slice(3)
    .filter((row) => row.trim())
    .map((row) => row.split(/\s+/g).slice(0, 2))
    .forEach(([name, pid]) => {
      processMap[name] = parseInt(pid);
    });

  return processMap;
};

module.exports = {
  getProcessNameList,
  getProcessMap,
};
