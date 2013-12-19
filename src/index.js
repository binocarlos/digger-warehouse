/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */


// ORIGINAL CONNECT LICENSE
/*!
 * Connect - HTTPServer
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var Router = require('./router');
var util = require('util');
var Mini = require('miniware');

// prototype

module.exports = function factory(){

  var app = Mini();
  var router = Router();

  function handler(req, reply, next){
    app(req, reply, function(){
      router(req, reply, next || function(){
        reply('404:route not found')
      });
    });
  }

  handler.__proto__ = new EventEmitter;

  /*
  
    wrap the mini use so we get paths also
    
  */
  handler.use = function(path, fn){
    if(path=='before'){
      app.before(fn);
      return;
    }

    if(arguments.length<=1){
      app.use(path);
    }
    else{
      app.use(function(req, reply, next){
        req.url = req.url || '/';
        if(req.url.indexOf(path)!==0){
          next();
        }
        else{
          req.url = req.url.substr(path.length);
          if(req.url.length==0){
            req.url = '/';
          }
          fn(req, reply, next);
        }
      })
    }
  }

  var methods = ['get','post','put','del'];

  methods.forEach(function(method){

    handler[method] = function(route, fn) {

      router[method].apply(router, [route, fn]);
      return app;

    }

  })

  return handler;
}