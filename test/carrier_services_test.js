var helper = require("./common.js");
helper.setObject("carrier_service");

var Resource = helper.resource();

helper.nock(helper.test_shop)
  .get('/admin/carrier_services.json')
  .reply(200, helper.load("all"), { server: 'nginx',
  status: '200 OK'
});

helper.nock(helper.test_shop)
  .get('/admin/carrier_services/962683576.json')
  .reply(200, helper.load("carrier_service"), { server: 'nginx',
  status: '200 OK'
});

helper.nock(helper.test_shop)
  .post('/admin/carrier_services.json', {
    "carrier_service": {
      "name": "Shipping Rate Provider",
      "callback_url": "http:\/\/shippingrateprovider.com",
      "format": "json",
      "service_discovery": true
    }
  })
  .reply(201, helper.load("create"), { server: 'nginx',
  	 status: '201 OK'
});

helper.nock(helper.test_shop)
  .put('/admin/carrier_services/962683579.json', {
    "carrier_service": {
      "id": 962683579,
      "name": "Some new name",
      "active": false,
      "service_discovery": true,
      "carrier_service_type": "api"
    }
  })
  .reply(201, helper.load("update"), { server: 'nginx',
  	 status: '200 OK',
});

helper.nock(helper.test_shop)
  .delete('/admin/carrier_services/962683575.json')
  .reply(201, {}, { server: 'nginx',
  	 status: '200 OK'
});


describe('Carrier Services', function() {
  var site = helper.endpoint;
  var resource = new Resource(site);

  it('should get all carrier services', function(done) {
    resource.all(function(err, res){
      res.should.not.be.empty;
      res[0].should.have.property('id');
      res[0].should.have.property('name');
      res[0].id.should.equal(962683577);
      done();
    });
  });

  it('should get a carrier service', function(done) {
    resource.get("962683576", function(err, res){
      res.should.be.a.Object();
      res.should.have.property('id');
      res.should.have.property('name');
      res.id.should.equal(962683576);
      done();
    });
  });

  it('should create a carrier service', function(done) {
      var _new = {
        "name": "Shipping Rate Provider",
        "callback_url": "http:\/\/shippingrateprovider.com",
        "format": "json",
        "service_discovery": true
      };

      resource.create(_new, function(err, _resource){
        _resource.should.have.property('id');
        done();
      });

   });


  it('should update a a carrier service', function(done) {
      var _mod = {
          "id": 962683579,
          "name": "Some new name",
          "active": false,
          "service_discovery": true,
          "carrier_service_type": "api"
      };

      resource.update("962683579" , _mod, function(err, _resource){
        _resource.should.have.property('id');
        done();
      });

   });

  it('should delete a carrier service', function(done) {

      resource.delete("962683575" , function(err, _resource){
        _resource.should.be.equal("962683575");
        done();
      });

   });

});
