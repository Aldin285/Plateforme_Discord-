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
    connectionStateRecovery:{
    maxDisconnectionDuration: Infinity,
    skipMiddlewares: true,
  },
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
  
});


  // Pour stocker les messages envoyés 
  // ne pas mettre cette variable dans le io.on("connection") sinon chaque utilisateur aura son propre historique
  const historique = []
  let connectedUsers = []


  let rooms = [{id:1,name:"General"},
      {id:2,name:"Room 1"}
    ]
  
  let oldConnectedUsers



  io.on("connection", (socket) => {

    let currentUser 

    console.log("-----------------------------" )
    console.log("Session ID :  : "+socket.id);
    console.log("-----------------------------" )

    if (socket.recovered) {
        console.log("-----------------------------" )
        console.log(`la session est récupéré`);
         console.log("-----------------------------" )
    }else {
        console.log("-----------------------------" )
        console.log("La session précédente est perdu")
        console.log("-----------------------------" )
    }

    // Page room
    socket.on("messageRoom", (msg,user,roomId) => {
      // Rejoindre le chat room
      socket.join(roomId)
      console.log("-----------------------------" )
      console.log("Votre message est : "+msg);
      console.log("-----------------------------" )

      // Envoi les messages dans une liste pour les récupérer après
      historique.push({expediteur:user,contenue:msg,roomId:roomId})

      // console.log("-----------------------------" )
      // console.log(historique)
      // console.log("-----------------------------" )
      
      io.to(roomId).emit("messageRoom", msg,user);
    });

    // Partie Username - Page Home
    socket.on("username", (username) => {
      console.log("-----------------------------" )
      console.log("New User: "+username);
      console.log("-----------------------------" )
      currentUser=username

      // enregistre le nom du user dans la session
      socket.data.username= currentUser
      
      // Envoi le nom du nouveau user dans la liste ( s'il n'est pas deja pris )
      if(!connectedUsers.includes(username)){
        connectedUsers.push(username)
      } 

      oldConnectedUsers = connectedUsers
    });
    
    // Renvoie les infos quand quelqu'un visite une page
    socket.on("enLigne", ()=>{

      setTimeout (()=>{
      io.emit("onlineUsers",connectedUsers);
      },1200)
      
      // l'historique est renvoyé à chaque fois qu'un nouveau user se connecte
      setTimeout (()=>{
      io.emit("historique",historique)
      },1200)

      // J'envoie les Rooms chat disponible
      setTimeout (()=>{
        io.emit("rooms",rooms);
      },1200)
    })

    // Supprime le nom du user de la liste quand il se déconnect
    socket.on("disconnect",(reason,details)=>{
      console.log("-----------------------------" )
      console.log("Cause de deconnexion :"+ reason)
      console.log("-----------------------------" )
      
      console.log("-----------------------------" )
      console.log("User "+ currentUser+" is no longer with us")
      console.log("-----------------------------" )

      oldConnectedUsers = connectedUsers
      connectedUsers = connectedUsers.filter(user => user !== currentUser);
      io.emit("onlineUsers",connectedUsers);

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