const { execSync } = require('child_process');
const args = process.argv.slice(2);
const chosenProcess = args[0] ? args[0] : 0;
const chosenDataType = args[1] ? args[1] : "mem";
const nvidiaSmiQueryOutput = execSync('nvidia-smi ', ['-q']).toString();

const querySplitted = nvidiaSmiQueryOutput.split("|    0");
querySplitted.shift();
querySplitted.pop();

const processData = querySplitted
    .map(process => {
        const data = process.replace("|\n", "").split(" ");

        return data.filter(_data => _data !== "");
    })
    .sort((a, b) =>{
        const aMemory = Number(a[a.length - 1].replace("MiB",""));
        const bMemory = Number(b[b.length -1].replace("MiB",""));

        return bMemory - aMemory;
    })
    [chosenProcess];

if (processData) {
    switch (chosenDataType) {
        case 'mem':
            return console.log(processData.pop(processData.length - 1));
        case 'pid':
            return console.log(`(${processData[2]})`);
        case 'name':
            return console.log(processData[4]);
    }
}

