import Terminal from "../Models/Terminal.js";


class ExecutionHandlers{

  static io = null;

  static initSocket(io) {
    if (!io) {
      throw new Error("socket <IO> object not defined");
    }

    this.io = io;

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}: ${socket.user}`);

      socket.on('start_terminal', (data) =>
        ExecutionHandlers.startTeminal(data, socket)
      );
      socket.on('run_code', (data) =>
        ExecutionHandlers.runCode(data, socket)
      );
      socket.on('exec_command', (data) =>
        ExecutionHandlers.execCommand(data, socket)
      );
      socket.on('pause_terminal', (data) =>
        ExecutionHandlers.pauseTerminal(data, socket)
      );
      socket.on('resume_terminal', (data) =>
        ExecutionHandlers.resumeTerminal(data, socket)
      );
      socket.on('stop_terminal', (data) =>
        ExecutionHandlers.stopTerminal(data, socket)
      );
    });
  }

  static async startTeminal(data, socket){

    try {
      const result = await Terminal.startNewTerminal(data, socket);
      socket.emit('start_terminal', result);
    } catch (error) {
      socket.emit('start_terminal', { valid:false, error: error.message });
    }

  }


  static async pauseTerminal(data, socket){
    try {
      const result = await Terminal.pauseTerminal(data, socket);
      socket.emit('pause_terminal', result);
    } catch (error) {
      socket.emit('pause_terminal', { valid:false, error: error.message });
    }

  }

  static  async resumeTerminal(data, socket){
    try {
      const result = await Terminal.resumeTerminal(data, socket);
      socket.emit('resume_terminal', result);
    } catch (error) {
      socket.emit('resume_terminal', { valid:false, error: error.message });
    }


  }

  static async stopTerminal(data){
    try {
        await Terminal.stopTerminal(data, socket);
        const result = await Terminal.deleteTerminal(data, socket);
      socket.emit('resume_terminal', result);
    } catch (error) {
      socket.emit('resume_terminal', { valid:false, error: error.message });
    }
  }

  static async runCode(data, socket){
    try{
      const result = await Terminal.runCode(data, socket)
      socket.emit('run_code', result);
    }catch(error){
      socket.emit('run_code', { valid:false, error: error.message });
    }
  }

  static async execCommand(data, socket){
    try{
      const result = await Terminal.runCode(data, socket)
      socket.emit('run_code', result);
    }catch(error){
      socket.emit('run_code', { valid:false, error: error.message });
    }
  }

}

export default ExecutionHandlers;

