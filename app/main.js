const net = require("net");
const { argv } = require("process");
const fs = require("fs");

const directory = argv[argv.indexOf("--directory") + 1];

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
function parseInput(data) {
  let arr = data.split("\r\n");
  return arr;
}

function generateResponse(
  statusCode,
  content = "",
  contentType = "text/plain"
) {
  let status = "OK";
  if (statusCode === 404) {
    status = "Not Found";
    return `HTTP/1.1 ${statusCode} ${status}\nContent-Length: ${content.length}\r\n\r\n`;
  }
  if (content) {
    return `HTTP/1.1 ${statusCode} ${status}\nContent-Type: ${contentType}\nContent-Length: ${content.length}\n\n${content}\r\n\r\n`;
  } else {
    return `HTTP/1.1 ${statusCode} ${status}\r\n\r\n`;
  }
}

const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", (data) => {
    let dataArr = parseInput(Buffer.from(data).toString());
    let path = dataArr[0].split(" ")[1];
    let requestType = dataArr[0].split(" ")[0];
    let userAgent = dataArr[2].split(" ")[1];
    const body = dataArr[dataArr.length - 1];

    if (path === "/") {
      socket.write(generateResponse(200));
    } else if (path === "/user-agent") {
      socket.write(generateResponse(200, userAgent));
    } else if (path.startsWith("/echo/")) {
      socket.write(generateResponse(200, path.slice(6)));
    } else if (path.startsWith("/files/")) {
      let filename = path.slice(7);
      if (requestType === "GET") {
        try {
          const fileContent = fs.readFileSync(
            `${directory}/${filename}`,
            "utf-8"
          );
          socket.write(
            generateResponse(200, fileContent, "application/octet-stream")
          );
        } catch (error) {
          socket.write(generateResponse(404, ""));
        }
      } else if (requestType === "POST") {
        fs.writeFileSync(`${directory}/${filename}`, body);
        socket.write(generateResponse(201, ""));
      }
    } else {
      socket.write(generateResponse(404));
    }
  });
});

server.listen(4221, "localhost");
