var Warehouse = require('../src');

describe('warehouse', function(){

  it('should be a function', function(done) {
    var warehouse = Warehouse();
    warehouse.should.be.a('function');
    done();
  })

  it('should complete a request response cycle', function(done) {

    var warehouse = Warehouse();

    warehouse.use(function(req, reply){
      reply(null, req.url);
    })

    warehouse({
      method:'get',
      url:'/10'
    }, function(error, answer){
      answer.should.equal('/10');
      done();
    })

  })

  it('should route based on method', function(done){
    var warehouse = Warehouse();

    warehouse.get(function(req, res){
      res.send('should not happen');
    })

    warehouse.post(function(req, reply){
      reply(null, req.body);
    })

    var req = {
      method:'post',
      body:10
    }

    warehouse(req, function(error, data){
      data.should.equal(10);
      done();
    });
  })

  it('pass back errors', function(done){
    var warehouse = Warehouse();

    warehouse.get(function(req, reply){
      throw new Error('should not happen');
    })

    warehouse.post('/apples', function(req, reply){
      reply('apples');
    })

    var req = {
      method:'post',
      url:'/apples'
    }

    warehouse(req, function(error, result){
      error.should.equal('apples');
      done();
    })

  })

  it('should route based on method and path containing variable ids', function(done){
    var warehouse = Warehouse();

    warehouse.get('/another/path/:id/:method', function(req, reply){
      req.params.id.should.equal('123');
      req.params.method.should.equal('dig');
      reply(null, req.body + 15);
    })

    var req = {
      method:'get',
      url:'/another/path/123/dig',
      body:10
    }

    warehouse(req, function(error, data){
      data.should.equal(25);
      done();
    });
  })

  it('should route based on path', function(done){
    var warehouse = Warehouse();

    warehouse.use('/a/path', function(req, reply){
      reply('should not happen');
    })

    warehouse.use('/another/path', function(req, reply){
      reply(null, 10);
    })

    var req = {
      method:'get',
      url:'/another/path',
      body:10
    }

    warehouse(req, function(error, data){
      data.should.equal(10);
      done();
    });
  })

  it('should chunk off the path as layers are matched', function(done){
    var warehouse = Warehouse();
    var subwarehouse = Warehouse();

    subwarehouse.use(function(req, reply){
      reply(null, req.url);
    })

    warehouse.use('/a/toppath', subwarehouse);

    var req = {
      method:'get',
      url:'/a/toppath/123'
    }

    warehouse(req, function(error, data){
      data.should.equal('/123');
      done();
    });
  })

  it('should respond with a 404 if the route is not found', function(done){
    var warehouse = Warehouse();

    warehouse.use('/somewhere/123', function(req, reply){
      reply(null, 'ok');
    })

    var req = {
      method:'get',
      url:'/somewhere/124'
    }

    warehouse(req, function(error, result){
      error.indexOf('404:').should.equal(0);
      done();
    });
  })

  it('should allow a handler to be inserted at the start of the stack', function(done){
    var warehouse = Warehouse();

    warehouse.use(function(req, reply, next){
      throw new Error('this should never happen');
    })
    
    warehouse.use('before', function(req, res, reply){
      done();
    })

    var req = {
      method:'get',
      url:'/'
    }

    warehouse(req, function(error, answer){

    })
  })
})
