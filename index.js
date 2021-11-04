// @ts-check
const { exec } = require('child_process');
const execPromise = require('util').promisify(exec);

/**
 * Get a list of raw process information from console.
 * @returns {Promise<string[][]>}
 */
const getRawProcessRows = async () => {
  const { stdout } = await execPromise('tasklist');

  return stdout
    .split('\n')
    .slice(3)
    .filter((row) => row.trim())
    .map((row) => row.split(/\s+/g));
};

/**
 * Get a list of all unique running process names.
 * @param {boolean} unique
 * @returns {Promise<string[]>}
 */
const getProcessNameList = async (unique = true) => {
  const rows = await getRawProcessRows();

  const names = rows.map((row) => row[0]);

  if (!unique) {
    return names.sort();
  }

  const processNameObject = {};

  names.forEach((name) => {
    processNameObject[name] = true;
  });

  return Object.keys(processNameObject).sort();
};

/**
 * Get an object of all running processes with key as process name and value as a list of process IDs.
 * @returns {Promise<Record<string, number[]>>}
 */
const getProcessNameToIdMap = async () => {
  const rows = await getRawProcessRows();
  const processMap = {};

  rows.forEach(([name, pid]) => {
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

if (require.main === module) {
  const [command, param] = process.argv.slice(2);

  switch (command) {
    case 'list':
      getProcessNameList(true).then((names) => {
        console.log(names.join('\n'));
      });
      break;
    case 'id':
      getProcessNameToIdMap().then((map) => {
        if (!map[param]) {
          return console.error('No process found with name: ' + param);
        }
        
        console.log(`Process ID for ${param}: ${map[param].join(', ')}`);
      });
      break;
    default:
      console.error('Invalid command');
  }
}
