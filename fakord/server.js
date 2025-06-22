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

  io.on("connection", (socket) => {
  
  

    // Page chat
    socket.on("message", (msg,user) => {
      console.log("Message envoyé par "+user +": "+msg);

      // Envoi les messages dans une liste pour les récupérer après
      historique.push({expediteur:user,contenue:msg})
      console.log(historique)
      
      io.emit("message", msg,user);
    });

    // Partie Username
    socket.on("username", (username) => {
      console.log("Username: "+username);
      
      // Stocker les nom des utilisateurs connectés 
      const connectedUser =[]
      connectedUser.push(username)

      // je crée un délai pour donner le temps à la page de récupérer le nom du user 
      setTimeout (()=>{
        io.emit("username", username);
      },1200)

      // l'historique est renvoyé à chaque fois qu'un nouveau user se connecte
      setTimeout (()=>{
      io.emit("historique",historique,username)
      },1200)
    });
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