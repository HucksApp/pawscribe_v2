import { exec } from 'child_process';

class DockerUtility {
  constructor(containerId) {
    this.containerId = containerId;
    this.originalState = null; // To store the container's initial state
  }

  async executeDockerCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error executing Docker command: ${stderr || error.message}`);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  async getContainerState() {
    const command = `docker inspect -f '{{.State.Status}}' ${this.containerId}`;
    return await this.executeDockerCommand(command);
  }

  async startContainer() {
    const command = `docker start ${this.containerId}`;
    return await this.executeDockerCommand(command);
  }

  async pauseContainer() {
    const command = `docker pause ${this.containerId}`;
    return await this.executeDockerCommand(command);
  }

  async unpauseContainer() {
    const command = `docker unpause ${this.containerId}`;
    return await this.executeDockerCommand(command);
  }

  async stopContainer() {
    const command = `docker stop ${this.containerId}`;
    return await this.executeDockerCommand(command);
  }

  async ensureContainerIsRunning() {
    this.originalState = await this.getContainerState();
    if (this.originalState === 'paused') {
      await this.unpauseContainer();
    } else if (this.originalState === 'exited' || this.originalState === 'created') {
      await this.startContainer();
    }
    // If it's already running, no action needed
  }

  async restoreOriginalState() {
    if (this.originalState === 'paused') {
      await this.pauseContainer();
    } else if (this.originalState === 'exited') {
      await this.stopContainer();
    }
    // If the original state was running, no action needed
  }

  async performOperationSafely(operation) {
    try {
      await this.ensureContainerIsRunning();
      const result = await operation();
      await this.restoreOriginalState();
      return result;
    } catch (error) {
      await this.restoreOriginalState();
      throw error; // Re-throw the error after restoring the state
    }
  }

  async copyFileToContainer(filePath, containerPath) {
    const operation = async () => {
      const command = `docker cp ${filePath} ${this.containerId}:${containerPath}`;
      return await this.executeDockerCommand(command);
    };
    return await this.performOperationSafely(operation);
  }

  async createFolderInContainer(folderPath) {
    const operation = async () => {
      const command = `docker exec ${this.containerId} mkdir -p ${folderPath}`;
      return await this.executeDockerCommand(command);
    };
    return await this.performOperationSafely(operation);
  }

  async deleteFileInContainer(filePath) {
    const operation = async () => {
      const command = `docker exec ${this.containerId} rm -f ${filePath}`;
      return await this.executeDockerCommand(command);
    };
    return await this.performOperationSafely(operation);
  }

  async deleteFolderInContainer(folderPath) {
    const operation = async () => {
      const command = `docker exec ${this.containerId} rm -rf ${folderPath}`;
      return await this.executeDockerCommand(command);
    };
    return await this.performOperationSafely(operation);
  }
}

export default DockerUtility;

