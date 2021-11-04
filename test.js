const { getProcessNameToIdMap, getProcessNameList } = require('./index');

(async () => {
  console.log(await getProcessNameToIdMap());
  console.log(await getProcessNameList());
})();
