import docker from 'dockerode';
import { v4 as uuidv4 } from 'uuid';
import OSContainer from '../Models/Container.js';

import Config from '../config/config.js';

class ContainerManager {
    static MAX_CONTAINERS_PER_USER = Config.MAX_CONTAINERS_PER_USER

    constructor() {
        this.activeContainers = {};
        this.client = new docker();
    }


    async createUserContainer(userId, language, tempDir) {
        this.manageUserContainer(userId);

        try {
            const containerInstance = new OSContainer('/app', this.client, language, tempDir, userId);
            this.activeContainers[userId].push(containerInstance);
            return containerInstance;
        } catch (error) {
            console.error(`Error creating container for user ${userId}: ${error.message}`);
            throw error;
        }
    }



    manageUserContainer(userId) {
        if (!this.activeContainers[userId]) {
            this.activeContainers[userId] = [];
        }

        if (this.activeContainers[userId].length >= ContainerManager.MAX_CONTAINERS_PER_USER) {
            const oldestContainer = this.activeContainers[userId].shift();
            this.cleanupContainer(oldestContainer);
        }
    }

    async deleteUserContainer(userId, id = null, name = null) {
        if (!id && !name) {
            throw new Error('Either container name or id is required');
        }
    
        if (!this.activeContainers[userId]) {
            throw new Error(`No active containers found for user ${userId}`);
        }
    
        // Find the container by id or name
        let containerIndex = -1;
        let containerInstance = null;
    
        this.activeContainers[userId].forEach((container, index) => {
            if (
                (id && container.containerId === id) || 
                (name && container.containerName === name)
            ) {
                containerIndex = index;
                containerInstance = container;
            }
        });
    
        if (containerIndex === -1) {
            throw new Error(`No container found for user ${userId} with id "${id}" or name "${name}"`);
        }
    
        // Remove the container from activeContainers and clean up
        this.activeContainers[userId].splice(containerIndex, 1);
    
        try {
            await this.cleanupContainer(containerInstance);
            console.log(`Successfully deleted container for user ${userId}: id "${id}", name "${name}"`);
        } catch (error) {
            console.error(`Error deleting container for user ${userId}: ${error.message}`);
            throw error;
        }
    }
    

    async cleanupContainer(containerInstance) {
        try {
            await containerInstance.cleanUpContainer();
        } catch (error) {
            console.error(`Error cleaning up container: ${error.message}`);
        }
    }


    async cleanupExistingDockerContainers(userId) {
        const containers = await this.client.listContainers({ all: true });
        for (const container of containers) {
            if (container.Names.some(name => name.includes(userId))) {
                console.log(`Cleaning up container ${container.Names[0]} for user ${userId}`);
                await this.client.getContainer(container.Id).stop();
                await this.client.getContainer(container.Id).remove();
            }
        }
    }

    async cleanupContainers() {
        console.log('Cleaning up all Docker containers...');
        for (const userId of Object.keys(this.activeContainers)) {
            while (this.activeContainers[userId].length > 0) {
                const containerInstance = this.activeContainers[userId].shift();
                this.cleanupContainer(containerInstance);
            }
        }

        const containers = await this.client.listContainers({ all: true });
        for (const container of containers) {
            if (container.Names.some(name => name.includes('container_'))) {
                console.log(`Cleaning up orphaned container: ${container.Names[0]}`);
                await this.client.getContainer(container.Id).stop();
                await this.client.getContainer(container.Id).remove();
            }
        }
    }




    async stopUserContainers(userId) {
        if (this.activeContainers[userId]) {
            for (const containerInstance of this.activeContainers[userId]) {
                await containerInstance.stop();
            }
            this.activeContainers[userId] = [];
        }
    }

    async getUserContainers(userId) {
        return this.activeContainers[userId] || [];
    }

    async getContainer(userId, rootFolderId) {
        const containers = this.activeContainers[userId] || [];
        return containers.find(container => container.rootFolderId === rootFolderId 
        ) || null;
    }


    /**
     * Get a container instance by its name.
     * @param {string} userId - The ID of the user.
     * @param {string} name - The name of the container to search for.
     * @returns {OSContainer|null} - The container instance if found, otherwise null.
     */
    getContainerByName(userId, name) {
        const containers = this.activeContainers[userId] || [];
        return containers.find(container => container.containerName === name) || null;
    }


    
    saveContainer(userId, containerInstance) {
        if (this.activeContainers[userId]) {
            const index = this.activeContainers[userId].findIndex(
                container => container.containerName === containerInstance.containerName
            );

            if (index !== -1) {
                // Update the existing container instance
                this.activeContainers[userId][index] = containerInstance;
            } else {
                // Add the container instance if not already present
                this.activeContainers[userId].push(containerInstance);
            }
        } else {
            // Create a new entry for the user and add the container instance
            this.activeContainers[userId] = [containerInstance];
        }
    }

}

export default ContainerManager;
