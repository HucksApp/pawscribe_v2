import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

class OSContainer {

    static imageMap = {
        python: { image: 'python:3.9-slim', cmd: 'python' },
        javascript: { image: 'node:16-alpine', cmd: 'node' },
        bash: { image: 'alpine', cmd: '/bin/sh' },
        c: { image: 'gcc:latest', cmd: '/bin/bash' },
        java: { image: 'openjdk:latest', cmd: 'java' },
        ruby: { image: 'ruby:latest', cmd: 'ruby' },
        go: { image: 'golang:latest', cmd: 'go' },
        php: { image: 'php:latest', cmd: 'php' },
        rust: { image: 'rust:latest', cmd: 'cargo' },
    };

    #cwd

    constructor( containerRoot='/app', docker = new Docker(),  language, tempDir, userId ) {
        this.docker = docker
        this.containerRoot = containerRoot;
        this.#cwd=this.containerRoot
        this.containerState = Object.freeze({
            NULL: "null",
            RUN: "run",
            PAUSED: "paused"
          });
        this.currentState=this.containerState.NULL
        this.userId = userId
        this.tempDir = tempDir
        this.language = language
        this.containerName = null
        this.container = ''
        this.container = null
        this.rootFolderId = null; // Add rootFolderId
        OSContainer.createDockerContainerPCMDL(this, this.docker, this.language, this.tempDir, userId)
    }

    static async createDockerContainerPCMDL(instance = null, docker = new Docker(),  language, tempDir, userId) {

        if (!OSContainer.imageMap[language]) {
            throw new Error(`Language '${language}' is not supported`);
        }

        const { image, cmd } = OSContainer.imageMap[language];
        const sanitizedTempDir = path.basename(tempDir).replace(/[^a-zA-Z0-9_-]/g, '_');

        if (!sanitizedTempDir) {
            throw new Error('Invalid temp_dir: must contain alphanumeric or underscore characters.');
        }

        const containerName = `${language}_${sanitizedTempDir}_${userId}_${uuidv4().slice(0, 8)}`;
        
        try {
            await docker.pull(image);
        } catch (error) {
            throw new Error(`Error pulling Docker image: ${error.message}`);
        }

        try {
            const container = await docker.createContainer({
                Image: image,
                Cmd: [cmd],
                name: containerName,
                Tty: true,
                OpenStdin: true,
                WorkingDir: '/',
                Volumes: {
                    '/app': {},
                },
                HostConfig: {
                    Binds: [`${tempDir}:/:rw`],
                    Memory: 512 * 1024 * 1024, // 512 MB
                    CpuShares: 512,
                },
            });

            //await container.start();
            if (instance && instance instanceof OSContainer)
            {
                instance.container = container
                instance.containerName = containerName
            }
            return [containerName, container];
        } catch (error) {
            throw new Error(`Error creating Docker container: ${error.message}`);
        }
    }

    addRootDir(rootFolderId){
        this.rootFolderId = rootFolderId
    }


    async executeCode(entryPoint) {
        const commandMap = {
            python: `python ${entryPoint}`,
            javascript: `node ${entryPoint}`,
            bash: `/bin/sh ${entryPoint}`,
            c: `gcc ${entryPoint} -o output && ./output`,
            java: `javac ${entryPoint} && java ${path.parse(entryPoint).name}`,
            ruby: `ruby ${entryPoint}`,
            go: `go run ${entryPoint}`,
            php: `php ${entryPoint}`,
            rust: `rustc ${entryPoint} && ./main`,
            //adding more language support here
        };

        const listFilesCommand = `ls -l ${path.dirname(entryPoint)}`;
        try {
            await this.container.exec({
                Cmd: ['/bin/sh', '-c', listFilesCommand],
            });

            const command = commandMap[this.language];
            if (!command) {
                throw new Error(`No command found for language '${this.language}'`);
            }

            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', command],
                AttachStdout: true,
                AttachStderr: true,
            });

            const stream = await exec.start();
            const output = await new Promise((resolve, reject) => {
                let result = '';
                stream.on('data', (data) => (result += data.toString()));
                stream.on('end', () => resolve(result));
                stream.on('error', reject);
            });

            return { exitCode: 0, output };
        } catch (error) {
            throw new Error(`Error executing code: ${error.message}`);
        }
    }

    async cleanUpContainer() {
        try {
            const containerInfo = await this.container.inspect();
            if (containerInfo.State.Running) {
                await this.container.stop();
                await this.container.remove();
            }
            if (fs.existsSync(this.tempDir)) {
                fs.rmdirSync(this.tempDir, { recursive: true });
            }
        } catch (error) {
            console.error(`Error during container cleanup: ${error.message}`);
            throw error;
        }
    }


    async executeCommand(command) {
        try {
            const fullCommand = `cd ${this.#cwd} && ${command}`;
            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', fullCommand],
                AttachStdout: true,
                AttachStderr: true,
            });
    
            const stream = await exec.start();
            const output = await new Promise((resolve, reject) => {
                let result = '';
                stream.on('data', (data) => (result += data.toString()));
                stream.on('end', () => resolve(result));
                stream.on('error', reject);
            });
    
            if (command.startsWith('cd ')) {
                this.setCwd(command)
            }
    
            return { exitCode: 0, output };
        } catch (error) {
            console.error(`Error executing command in container: ${error.message}`);
            throw error;
        }
    }

    getCwd(){
        return this.#cwd
    }

     // Set and update the working directory
    async setCwd(command) {
        try {
            const validateDirCommand = `cd ${this.#cwd} && ${command} && pwd`;
            const exec = await this.container.exec({
                Cmd: ['/bin/sh', '-c', validateDirCommand],
                AttachStdout: true,
                AttachStderr: true,
            });

            const stream = await exec.start();
            const output = await new Promise((resolve, reject) => {
                let result = '';
                stream.on('data', (data) => (result += data.toString()));
                stream.on('end', () => resolve(result.trim())); // Trim to avoid newline issues
                stream.on('error', reject);
            });

            if (output) {
                this.#cwd = output; // Update private field if directory is valid
                console.log(`Working directory updated to: ${this.#cwd}`);
                return this.#cwd;
            } else {
                throw new Error(`Invalid directory cwd`);
            }
        } catch (error) {
            console.error(`Failed to set working directory: ${error.message}`);
            throw error;
        }
    }


    async pause(){
        return await this.container.pause();
    }

    async resume(){
        return await this.container.unpause();
    }

    async start(){
        return await this.container.start();
    }

    async stop(){
        return await this.container.stop();
    }

}

export default OSContainer;

