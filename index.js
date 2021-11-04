const { exec } = require('child_process');
const execPromise = require('util').promisify(exec);

/**
 * Get a list of all unique running process names.
 * @returns {Promise<string[]}
 */
const getProcessNameList = async () => {
  const { stdout } = await execPromise('tasklist');
  const processNameObject = {};

  stdout
    .split('\n')
    .slice(3)
    .filter((row) => row.trim())
    .map((row) => row.split(/\s+/g)[0])
    .forEach((name) => {
      processNameObject[name] = true;
    });

  return Object.keys(processNameObject).sort();
};

/**
 * Get an object of all running processes with key as process name and value as a list of process IDs.
 * @returns {Promise<Record<string, number[]>>}
 */
const getProcessNameToIdMap = async () => {
  const { stdout } = await execPromise('tasklist');
  const processMap = {};

  stdout
    .split('\n')
    .slice(3)
    .filter((row) => row.trim())
    .map((row) => row.split(/\s+/g).slice(0, 2))
    .forEach(([name, pid]) => {
      const processID = parseInt(pid);

      if (isNaN(processID)) {
        return;
      }

      if (processMap[name]) {
        processMap[name].push(processID);
      } else {
        processMap[name] = [processID];
      }
    });

  return processMap;
};

module.exports = {
  getProcessNameList,
  getProcessNameToIdMap,
};
