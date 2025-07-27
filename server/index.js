const express = require("express");
const http = require("http");
const fs = require("fs/promises");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const pty = require('node-pty');
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

var ptyProcess = pty.spawn('bash', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + '/user',
  env: process.env 
});



const io = new Server(server, {
  cors: {
    origin: "https://code-along-52s1.vercel.app/", // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

  const userSocketMap={};

  const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    }); 
};

// io.attach(server);

ptyProcess.onData((data) => {
  io.emit('terminal:data', data);
});


io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
socket.on('join',({roomId,username})=>{
           userSocketMap[socket.id]=username;// now there are multiple users coming up with different  socket id , now we have to club them 
           // into the same room id 
           
           socket.join(roomId)// if room if exist that will  put that into that room ... if not exist will create a new room

           const clients=getAllConnectedClients(roomId);

           clients.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                clients,
                username,
                socketId:socket.id
            })
           })
}) 

     socket.on('code-change',({roomId,code})=>{
      socket.in(roomId).emit('code-change',{ code});
     })
   
    socket.on("sync-code",({socketId,code})=>{
      io.to(socketId).emit("code-change",{code})
    })  
    //  // if new user is  joining he should get the existing code 

    socket.on('terminal:write',(data)=>{
        ptyProcess.write(data);
    })
 

socket.on("disconnecting", () => {
  const rooms = [...socket.rooms];     

  rooms.forEach((roomId) => {
      io.to(roomId).emit("disconnected", {
          socketId: socket.id,
          username: userSocketMap[socket.id], // Fixed `socketId`
      });
      socket.leave(roomId); // Fixed incorrect syntax
  });

  delete userSocketMap[socket.id]; // Fixed typo
});


});


app.get("/files",async (req,res)=>{
  try {
    const fileTree=await generatetree(path.join(__dirname, 'user'));
    return res.json({tree:fileTree});
  } catch (error) {
    console.error('Error generating file tree:', error);
    return res.status(500).json({error: 'Failed to generate file tree', tree: {}});
  }
})

// Create a new file
app.post("/files/create", async (req, res) => {
  try {
    const { filePath, content = "" } = req.body;
    const fullPath = path.join(__dirname, 'user', filePath);
    
    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Create the file
    await fs.writeFile(fullPath, content);
    
    res.json({ success: true, message: "File created successfully" });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ error: "Failed to create file" });
  }
});

// Create a new folder
app.post("/files/createFolder", async (req, res) => {
  try {
    const { folderPath } = req.body;
    const fullPath = path.join(__dirname, 'user', folderPath);
    
    await fs.mkdir(fullPath, { recursive: true });
    
    res.json({ success: true, message: "Folder created successfully" });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: "Failed to create folder" });
  }
});

// Read file content
app.get("/files/read/:filePath(*)", async (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(__dirname, 'user', filePath);
    
    const content = await fs.readFile(fullPath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Save file content
app.post("/files/save", async (req, res) => {
  try {
    const { filePath, content } = req.body;
    const fullPath = path.join(__dirname, 'user', filePath);
    
    await fs.writeFile(fullPath, content);
    res.json({ success: true, message: "File saved successfully" });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: "Failed to save file" });
  }
});

// Check if g++ is installed
app.get("/check-compiler", async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('g++ --version', (error, stdout, stderr) => {
      if (error) {
        res.json({ installed: false, message: "g++ not found" });
      } else {
        res.json({ installed: true, version: stdout.split('\n')[0] });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check compiler" });
  }
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


async function generatetree(directory) {
  const tree={}

  async function buildtree(currentDir,currentTree) {
    try {
      const files= await fs.readdir(currentDir);

      for(const file of files){
        const filePath=path.join(currentDir,file);
        
        try {
          const stats=await fs.stat(filePath);

          if(stats.isDirectory()){
            currentTree[file]={};
            await buildtree(filePath,currentTree[file]);
          }else{
            currentTree[file]=null;
          }
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
          // Skip this file and continue
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentDir}:`, error);
      throw error;
    }
  }

  // Check if directory exists first
  try {
    await fs.access(directory);
    await buildtree(directory,tree);
  } catch (error) {
    console.error(`Directory ${directory} does not exist or is not accessible:`, error);
    throw error;
  }
  
  return tree;
}