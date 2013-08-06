digger-network
==============

The contract / request and reply modules for digger


## Request

A simple object that represents a HTTP request in JSON

```js
var network = require('digger-network');

var req = network.request({
	method:'get',
	url:'/some/url'
})

req.setHeader('x-some-thing', '3434');

```

## Response

An object representing a HTTP response - you can pass a function to be called when it has replied

```js
var network = require('digger-network');

var res = network.response(function(){
	console.log('statuscode: ' + res.statusCode);	
	console.log('body: ' + res.body);
})
```

Or you can construct a response from raw JSON

```js

var network = require('digger-network');

var res = network.response({
	statusCode:200,
	headers:{
		'content-type':'text/plain'
	},
	body:'hello digger'
}

```

## Contract

A contract is an array of requests to be run as a batch either in series (a pipe contract) or in parallel (a merge contract).

Contracts are produced by running queries on digger containers - they are handled by the [digger-contracts](https://github.com/binocarlos/digger-contracts) module

A contract representing posting data to 2 different places

```js
var network = require('digger-network');

var contract = network.contract({
	method:'post',
	url:'/reception',
	headers:{
		'content-type':'digger/contract',
		'x-contract-type':'merge'
	},
	body:[{
		method:'post',
		url:'/some/database/path',
		body:'hello database 1'
	},{
		method:'post',
		url:'/some/other/path',
		body:'hello database 2'
	}]
}
})

```

## Licence

MIT