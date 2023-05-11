const { exec } = require("child_process");
const process = require("process");
const fs = require("fs");

class CommandExecutor {
  execute = function (command) {
    return new Promise((resolve, reject) => {
      const childProcess = exec(command, {},(error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
        return resolve(stdout);
      });
      childProcess.stdout.pipe(process.stdout);
    });
  };
}
const executor = new CommandExecutor();

function goToTheRootProjectLocation () {
  const path = process.cwd();
  const rootProjectPath = path.replace('deployment', '');
  process.chdir(rootProjectPath);
}

function removeDependencies() {
  goToTheRootProjectLocation();
  process.stdout.write("#### Deleting node modules directory... ####\n");
  fs.rmSync("node_modules", { recursive: true, force: true });
}

async function installDependencies(forProduction = false) {
  const logMessage = forProduction ? '#### Installing dependencies for production... ####\n' : '#### Installing dependencies... ####\n';
  process.stdout.write(logMessage);
  await executor.execute(forProduction ? 'npm install --omit=dev' : 'npm install');
}

async function buildApplication() {
  process.stdout.write("#### Building application... ####\n");
  await executor.execute('npm run build');
}

function copyDependenciesToTheBuiltApplication() {
  process.stdout.write("#### Copying node modules folder to dist... ####\n");
  fs.cpSync("node_modules/", "dist/node_modules/", { recursive: true, force: true });
}

async function deployApplicationUsingSamCli() {
  process.chdir("deployment");
  process.stdout.write('#### Deploying application... ####\n');
  await executor.execute('sam deploy');
}

async function prepareApplicationForDeployment() {
  goToTheRootProjectLocation();
  fs.rmSync("dist", { recursive: true, force: true });
  removeDependencies();

  await installDependencies();
  await buildApplication();
}

async function testApplication() {
  process.stdout.write('#### Testing application... ####\n');
  await executor.execute('npm run test');
}

async function deployApplication() {
  removeDependencies();
  await installDependencies(true);
  copyDependenciesToTheBuiltApplication();
  await deployApplicationUsingSamCli();
}

async function processDeploymentPipeline() {
  await prepareApplicationForDeployment();
  await testApplication();
  await deployApplication();
}

processDeploymentPipeline()
.then(() => {
  process.exit(0);
});