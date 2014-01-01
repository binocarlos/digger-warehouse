digger-warehouse
================

A very simple middleware chain for plain rpc requests


## installation

	$ npm install digger-warehouse --save

## usage

The warehouse is a function through which you pass an object (packet), a callback (responder) and a next (classic middleware style).

An example of a basic warehouse setup:

```js
var Warehouse = require('digger-warehouse');

var warehouse = Warehouse();

// middleware means we can augment the request and pass it down the chain
warehouse.use(function(req, reply, next){
	req.iwashere = 23;
})

warehouse.use(function(req, reply, next){
	reply(null, 'I was here: ' + req.iwashere');
})

```

To call this - it is just a case of calling the warehouse function with a request:

```js
warehouse({
	value:20
}, function(error, result){
	console.log(result);
})

// I was here: 23

```

### faking http

A warehouse can be used with plain old packets but it can also simulate REST requests and match the url and method.

```js
var warehouse = Warehouse();

// only requests with a url field of '/api/v1' will run this function
warehouse.use('/api/v1', function(req, reply, next){

})

// only requests that are posted here will be run - params are extracted
warehouse.post('/api/v1/:id', function(req, reply, next){
	reply(null, 'posted to ' + req.params.id);
})

```

## licence

MIT