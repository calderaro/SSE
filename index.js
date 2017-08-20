const http = require('http')
const sys = require('sys')
const fs = require('fs')

http.createServer((req, res) => {
  // debugHeaders(req)
  if (req.headers.accept && req.headers.accept === 'text/event-stream') {
    if (req.url === '/events') {
      sendSSE(req, res)
    } else {
      res.writeHead(404)
      res.end()
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.write(fs.readFileSync(__dirname + '/index.html'))
    res.end()
  }
}).listen(8000)

function sendSSE (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const id = (new Date()).toLocaleTimeString()

  // Sends a SSE every 5 seconds on a single connection.
  setInterval(() => constructSSE(res, id, (new Date()).toLocaleTimeString()), 5000)

  constructSSE(res, id, (new Date()).toLocaleTimeString())
}

function constructSSE (res, id, data) {
  res.write('id: ' + id + '\n')
  res.write('data: ' + data + '\n\n')
}

function debugHeaders (req) {
  sys.puts('URL: ' + req.url)
  for (const key in req.headers) {
    sys.puts(key + ': ' + req.headers[key])
  }
  sys.puts('\n\n')
}
