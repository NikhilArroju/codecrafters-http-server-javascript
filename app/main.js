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
    let thirdLine = dataArr[2];
    let firstLineData = firstLine.split(" ");
    let path = firstLineData[1];
    let thirdLineData = thirdLine.split(" ");
    let userAgent = thirdLineData[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path === "/user-agent") {
      socket.write(
        `HTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: ${userAgent.length}\n\n${userAgent}\r\n\r\n`
      );
    } else if (path.startsWith("/echo/")) {
      socket.write(
        `HTTP/1.1 200 OK\nContent-Type: text/plain\nContent-Length: ${
          path.slice(6).length
        }\n\n${path.slice(6)}\r\n\r\n`
      );
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});

server.listen(4221, "localhost");
