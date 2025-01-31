class BroadcastExecutionHandlers {
    static collaborators = {}; // Maps rootFolderId to an array of socket IDs
    static io = null; 
  
    static async initSocket(io) {
      if (!io) {
        throw new Error("socket <IO> object not defined");
      }
      this.io = io
      if (this.io) {
        io.on('connection', (socket) => {
          console.log(`User connected: ${socket.id}: ${socket.user}`);
          
          socket.on('join_project', async (data) => this.joinProject(data, socket));
          socket.on('leave_project', async (data) => this.leaveProject(data, socket));
          socket.on('broadcast_terminal', async (data) => this.broadcastTerminal(data, socket));
          socket.on('broadcast_file_change', async (data) => this.broadcastFileChange(data, socket));
          socket.on('disconnect', () => this.handleDisconnect(socket));
        });
      } else {
        throw new Error("Socket.IO object not defined");
      }
    }
  
    static async joinProject(data, socket) {
      const { rootFolderId } = data;
      if (!rootFolderId) return;
  
      if (!this.collaborators[rootFolderId]) {
        this.collaborators[rootFolderId] = [];
      }
      this.collaborators[rootFolderId].push(socket.id);
  
      socket.join(rootFolderId);
      console.log(`Socket ${socket.id} joined project ${rootFolderId}`);
    }
  
    static async leaveProject(data, socket) {
      const { rootFolderId } = data;
      if (!rootFolderId || !this.collaborators[rootFolderId]) return;
  
      this.collaborators[rootFolderId] = this.collaborators[rootFolderId].filter((id) => id !== socket.id);
      socket.leave(rootFolderId);
      console.log(`Socket ${socket.id} left project ${rootFolderId}`);
    }
  
    static async broadcastTerminal(data, socket) {
      const { rootFolderId, output } = data;
      if (!rootFolderId || !output) return;
  
      socket.to(rootFolderId).emit('terminal_update', { output });
      console.log(`Broadcasting terminal update to project ${rootFolderId}`);
    }
  
    static async broadcastFileChange(data, socket) {
      const { rootFolderId, fileChange } = data;
      if (!rootFolderId || !fileChange) return;
  
      socket.to(rootFolderId).emit('file_update', { fileChange });
      console.log(`Broadcasting file change to project ${rootFolderId}`);
    }
  
    static async handleDisconnect(socket) {
      for (const [rootFolderId, sockets] of Object.entries(this.collaborators)) {
        this.collaborators[rootFolderId] = sockets.filter((id) => id !== socket.id);
        if (this.collaborators[rootFolderId].length === 0) {
          delete this.collaborators[rootFolderId];
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    }
  }
  

export default BroadcastExecutionHandlers;