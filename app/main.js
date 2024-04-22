const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
function parseInput(data) {
  let arr = data.split("\r\n");
  return arr;
}

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", (data) => {
    let dataArr = parseInput(Buffer.from(data).toString());
    let firstLine = dataArr[0];
    let firstLineData = firstLine.split(" ");
    let path = firstLineData[1];
    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path.startsWith("/echo/")) {
      let s = path.split("/")[2];
      socket.write(
        `HTTP/1.1 404 Not Found\r\n\r\nContent-Type: text/plain\r\n\r\nContent-Length: ${s.length}\r\n\r\n\r\n\r\n${s}\r\n\r\n`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});

server.listen(4221, "localhost");
