const express = require('express');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

app.use(cors());

// app.use(function(req, res, next) {
// 	alert('cors allowed!!');
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   //next();
// });


const nodeAddress = uuid().split('-').join(''); 

const voting = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.get('/',function(req,res){
// 	res.send('Hello world!')
// })

app.get('/blockchain', function(req, res){
	res.send(voting);
});

app.post('/vote', function(req, res){
	//console.log(req.body);
	//res.send('Hey its working!');
	const blockIndex = voting.createNewVote(req.body.For);
	res.json({note: `This vote will be added in block ${blockIndex}.`});
});



// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


app.post('/vote/broadcast', function(req,res){
	const newVote = voting.createNewVote(req.body.For);

//console.log(newVote);

	const requestPromises = [];
	voting.networkNodes.forEach(networkNodeUrl=> {
		const requestOptions = {
			uri: networkNodeUrl + '/vote',
			method: 'POST',
			body: { For: req.body.For},
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises)
		.then(data=> {
			res.json({ note: 'Vote given and broadcasted successfully.'})
		}).catch(function(){
			console.log("Error Occured!!!");
		});
		 
});



app.get('/mine', function(req , res){
	//res.send('Mining Code Not Ready!');
	const lastBlock = voting.getLastBlock();
	const previousBlockHash = lastBlock['hash'];
	const currentBlockData = {
		Vote: voting.pendingVote,
		index: lastBlock['index'] + 1
	};
	const nonce = voting.proofOfWork(previousBlockHash, currentBlockData);
	const bloshHash = voting.hashBlock(previousBlockHash,currentBlockData,nonce);

	const newBlock = voting.createNewBlock(nonce, previousBlockHash, bloshHash);

	const requestPromises = [];
	voting.networkNodes.forEach(networkNodeUrl=> {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};
		requestPromises.push(rp(requestOptions));
	});
	Promise.all(requestPromises)
	.then(data=> {
		//.........
		res.json({
		note: "New block mine successfully",
		block: newBlock
	 });
	
  });
	
});


app.post('/receive-new-block',function(req,res){
	const newBlock = req.body.newBlock;
	const lastBlock = voting.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.previousBlockHash;
	const correctIndex = lastBlock['index'] +1 === newBlock['index'];

	if(correctHash && correctIndex){
		voting.chain.push(newBlock);
		voting.pendingVote = '';
		res.json({
			note: 'New block received and accepted.'
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock 
		});
	}
});


app.post('/register-and-broadcast-node', function(req,res){
	const newNodeUrl = req.body.newNodeUrl;
	//const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = voting.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = voting.currentNodeUrl !== newNodeUrl;
	if(nodeNotAlreadyPresent && notCurrentNode) voting.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	voting.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl},
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises).then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl+ '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...voting.networkNodes, voting.currentNodeUrl]},
			json: true
		};
		return rp(bulkRegisterOptions);

	})
		.then(data => {
			res.json({ note: 'New node registered with network successfully.'});
		});
});

app.post('/register-node',function(req,res){
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = voting.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = voting.currentNodeUrl !== newNodeUrl;
	if(nodeNotAlreadyPresent && notCurrentNode) voting.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.'});
});

app.post('/register-nodes-bulk', function(req,res){
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl=> {
		const nodeNotAlreadyPresent = voting.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = voting.currentNodeUrl !== networkNodeUrl;
		if(nodeNotAlreadyPresent && notCurrentNode) voting.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.'});
});

app.get('/consensus', function(req,res){
	//alert('hey');
	const requestPromises = [];
	voting.networkNodes.forEach(networkNodeUrl =>{
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains=>{
		const currentChainLength = voting.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingVote = null;

		blockchains.forEach(blockchain => {
			if(blockchain.chain.length > maxChainLength){
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingVote = blockchain.pendingVote;
			};
		});

		if(!newLongestChain || (newLongestChain && !voting.chainIsValid(newLongestChain))){
			res.json({
				note: 'Current chain has not been replaced.',
				chain: voting.chain
			});
		}
		else if(newLongestChain && voting.chainIsValid(newLongestChain)){
			voting.chain = newLongestChain;
			voting.pendingVote = newPendingVote;
			res.json({
				note: 'This chain has been replaced.',
				chain: voting.chain
			});
		}
	});//.then end
});

app.get('/getmyaddress', function(req,res){
	res.send(`This Node Address is --------> ${nodeAddress}.`);
});


app.get('/getresult', function(req,res){
	var result={
		A : 0,
		B : 0,
		C : 0,
		No_Vote: 0
	};

	voting.chain.forEach(block=> {
		if(block.Vote == 'A' ) result.A++;
		else if (block.Vote == 'B') result.B++;
		else if (block.Vote == 'C') result.C++;
		else result.No_Vote++;
	});
	res.send(result);
});



app.listen(port, function(){
	console.log(`Listening on port ${port}.....`);
})