export function Emit(socket, event, options) {
  socket.emit(event, options);
}
