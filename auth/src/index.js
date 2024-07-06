"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // const { Server } = require("socket.io");
    // const io = new Server(strapi.server.httpServer, {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"],
    //     credentials: true,
    //   },
    // });


    // io.on("connection", (socket) => {
    //   console.log("A user connected: ", socket.id);
    //   console.log("inside io");

    //   socket.on('message', (data) => {
    //     console.log("inside socket: ", data);
    //     socket.emit('client-message', data + " thekhaliqansari");
    //   })

    //   socket.on("disconnect", () => {
    //     console.log("A user disconnected: ", socket.id);
    //   });
    // });

    // strapi.io = io;
    const { Server } = require("socket.io");
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected: ", socket.id);

      socket.on("send-message", (message) => {
        console.log("Message received from client: ", message);
        const newMessage = {
          id: new Date().getTime(),
          uid: socket.id,
          message: message,
        };
        console.log("this is new message: ", newMessage)
        socket.emit("receive-message", newMessage); // Send the message back to the sender
        console.log("Message sent to client: ", newMessage);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.id);
      });
    });

    strapi.io = io;
  },
};
