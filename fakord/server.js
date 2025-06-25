import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


  // Pour stocker les messages envoyés 
  // ne pas mettre cette variable dans le io.on("connection") sinon chaque utilisateur aura son propre historique
  const historique = []
  let connectedUsers = []
  
  let oldConnectedUsers



  io.on("connection", (socket) => {
    let currentUser 

    // Page chat
    socket.on("message", (msg,user) => {
      console.log("-----------------------------" )
      console.log("Message envoyé par "+user +": "+msg);
      console.log("-----------------------------" )

      // Envoi les messages dans une liste pour les récupérer après
      historique.push({expediteur:user,contenue:msg})
      console.log("-----------------------------" )
      console.log(historique)
      console.log("-----------------------------" )
      
      io.emit("message", msg,user);
    });

    // Partie Username
    socket.on("username", (username) => {
      console.log("-----------------------------" )
      console.log("New User: "+username);
      console.log("-----------------------------" )
      currentUser=username
      
      // Envoi le nom du nouveau user dans la liste ( s'il n'est pas deja pris )
      if(!connectedUsers.includes(username)){
        connectedUsers.push(username)
      } 

      oldConnectedUsers = connectedUsers

      // je crée un délai pour donner le temps à la page de récupérer le nom du user 
      setTimeout (()=>{
        io.emit("onlineUsers",connectedUsers,oldConnectedUsers);
      },1200)

      // l'historique est renvoyé à chaque fois qu'un nouveau user se connecte
      setTimeout (()=>{
      io.emit("historique",historique)
      },1200)
    });

    // Supprime le nom du user de la liste quand il se déconnect
    socket.on("disconnect",()=>{
      console.log("-----------------------------" )
      console.log("User "+ currentUser+" is no longer with us")
      console.log("-----------------------------" )

      oldConnectedUsers = connectedUsers
      connectedUsers = connectedUsers.filter(user => user !== currentUser);
      io.emit("onlineUsers",connectedUsers,oldConnectedUsers);

      // mise à jour de la liste
      oldConnectedUsers= connectedUsers
      
    })

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});