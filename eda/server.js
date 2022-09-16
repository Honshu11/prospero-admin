var http = require('http')
var crypto = require('crypto')
var child_process = require('child_process')
var fsPromises = require('fs/promises')


var server = http.createServer(function(req, res) {
	var sourceCode

	  let data = '';
	  req.on('data', chunk => {
	    data += chunk;
	  });
	  req.on('end', () => {
	        sourceCode = data.toString()
	    	
		runSimulation(sourceCode, function(output) {
			res.writeHead(200);
			res.end(output);
		})

	  });
})

server.listen(80)
console.log('iverilog server started on port 80')

async function runSimulation(sourceCode, done) {
	// Create tmp folder
	var tmpFolderBase = '/root/tmp/'
	var tmpFolder = tmpFolderBase + crypto.randomBytes(16).toString('hex')
	var createdFolder = await fsPromises.mkdir(tmpFolder, {
		recursive: true
	})
	console.log('tmpFolder', tmpFolder)

	// Write Source File
	var sourceFilename = 'source.v'
	var fullSourcePath = tmpFolder + '/' + sourceFilename
	await fsPromises.writeFile(fullSourcePath, sourceCode)

	// Run script
	var fullScriptPath = 'sim_script'
	var scriptProcess = child_process.spawn(fullScriptPath, {
		cwd: tmpFolder,
		shell: true,
	})

	var output = ''

	scriptProcess.stdout.on('data', function(data) {
		output += data
	})

	scriptProcess.stderr.on('data', function(data) {
		output += data
	})

	scriptProcess.on('close', function(code) {
	console.log('output', output)

		done(output)
	})
}
