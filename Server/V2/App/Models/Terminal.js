import fs, { stat } from 'fs';
import Folder from "./Folder.js";
import File from "./File.js";
import ContainerManager from "../manager/ContainerManager.js"
import SyncContainerToMongo from "../synchronizer/containerSync.js"
import SyncMongoToContainer from "../synchronizer/mongoSync.js"
import FileSystemManager from '../manager/fileSys.js';


class Terminal{

    static terminalManager = new ContainerManager()
  
    static async startNewTerminal(data, socket){
        const { rootFolderId, language } = data.info
        const userId = socket.user._id;
        if (!language) 
            return { message: 'Language is required', status: 400 }
        if (!rootFolderId) 
            return { message: 'No root directory Id', status: 400 }
        try{
          const { valid, status, folder:rootFolder , message } =
          await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
            const tempDir = fs.mkdtempSync(rootFolder.name);
            const terminal = Terminal.terminalManager.createUserContainer(userId, language, tempDir);
            //sync Mongo
            terminal.syncMongo = new SyncMongoToContainer(terminal.container.id, {Folder, File}, tempDir, rootFolderId)
            terminal.syncMongo.startWatch()
            //sync Container
            terminal.syncContainer = new SyncContainerToMongo(userId,tempDir,rootFolderId)
            terminal.syncContainer.startWatch()

            terminal.rootFolderId = rootFolderId
            terminal.currentState = terminal.containerState.RUN
            Terminal.terminalManager.saveContainer(userId, terminal);
            return  {valid: true, message: "created", terminal};
        }catch(error){
          throw error;
        }
    }


  static async pauseTerminal(data, socket){
      const { rootFolderId } = data.info
      const userId = socket.user._id;
      const { valid, status, message } =
            await Terminal.securelyGetFolder(userId, rootFolderId);
            if (!valid) return { valid, status, message };
            const container = Terminal.terminalManager.getContainer(userId, rootFolderId)
            //changes done outside terminal need to be sync to container
            //container.syncMongo.pauseWatch() 
            await container.syncContainer.pauseWatch()
            container.currentState = container.containerState.PAUSED
            await container.container.pause()
            Terminal.terminalManager.saveContainer(userId, container);
            return {valid: true, message: "paused", container};
    }
    


static async resumeTerminal(){
  const { rootFolderId } = data.info
  const userId = socket.user._id;
  const { valid, status, message } =
        await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
        const container = Terminal.terminalManager.getContainer(userId, rootFolderId)
        container.syncMongo.resumeWatch()
            await container.syncContainer.resumeWatch()
            container.currentState = container.containerState.PAUSED
            return await container.container.unpause()
    }




static async stopTerminal(data, socket){
  const { rootFolderId } = data.info
  const userId = socket.user._id;
  const { valid, status, message } =
        await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
        const container = Terminal.terminalManager.getContainer(userId, rootFolderId)
        if (container.currentState !== container.containerState.NULL){
        container.syncMongo.stopWatch()
            await container.syncContainer.stopWatch()
            container.currentState = container.containerState.NULL
            return await container.container.stop()
          }
          return null;
}


static async deleteTerminal(data, socket){
  const { rootFolderId } = data.info
  const userId = socket.user._id;
  const { valid, status, message } =
        await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
        const container = Terminal.terminalManager.getContainer(userId, rootFolderId)
        if (container.currentState !== container.containerState.NULL)
          await Terminal.stopTerminal()
          await Terminal.terminalManager.deleteUserContainer(userId, container.id)
          return { valid:true, status:200, message:"terminal deleted"}
}


    static async runCode(data, socket){
      const { rootFolderId, entryPointFileId, language, code } = data.info;
      const userId = socket.user._id;
      if (!language) 
        return { message: 'Language is required', status: 400 }
      if (!rootFolderId) 
        return { message: 'No root directory Id', status: 400 }
      try{
        const { valid, status, folder:rootFolder , message } =
        await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
        let container;
        container = Terminal.terminalManager.getContainer(userId, rootFolderId)
        if (!container){
            const {terminal} = Terminal.startNewTerminal(data, socket)
            container = terminal
        }
                const { entryPoint, entryPointPath: resolvedPath } = await FileSystemManager.determineEntryPoint(
                    rootFolderId,
                    userId,
                    entryPointFileId,
                    tempDir
                );
                const entryPointPath = resolvedPath.replace(tempDir, container.containerRoot);
                const { exitCode, output } = await container.executeCode(entryPointPath);
                return { valid: true, result:{ exitCode, output} }
      }catch(error){
        throw error
      }

    }


  async executeCommand (data, socket) {
    const { rootFolderId, command } = data.info;
      const userId = socket.user._id;
      
      if (!language) 
        return { message: 'Language is required', status: 400 }
      if (!rootFolderId) 
        return { message: 'No root directory Id', status: 400 }
      try{
        const { valid, status, message } =
        await Terminal.securelyGetFolder(userId, rootFolderId);
        if (!valid) return { valid, status, message };
        const container = Terminal.terminalManager.getContainer(userId, rootFolderId)
        return await container.executeCommand(command)
      }
      catch(error){
        throw error
      }
    }





    static async securelyGetFolder(userId, folderId) {
        const folder = await Folder.findById(folderId);
        if (!folder) {
          return { valid: false, status: 404, error: "Folder not found" };
        }
        // Check folder ownership
        if (folder.owner_id.toString() !== userId) {
          return {
            status: 403,
            valid: false,
            message: "Permission denied",
          };
        }
        return { valid: true, status: 200, folder };
      }


}


export default Terminal;