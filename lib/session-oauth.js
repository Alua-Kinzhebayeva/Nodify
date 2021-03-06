// Generated by CoffeeScript 1.10.0
(function() {
  var Blog, Order, Product, Resource, Session, SessionOAuth,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Blog = require('./resources/blog');

  Product = require('./resources/product');

  Order = require('./resources/order');

  Resource = require('./resource');

  Session = require('./session');

  SessionOAuth = (function(superClass) {
    extend(SessionOAuth, superClass);

    function SessionOAuth(store_name, api_key, secret, params) {
      this.store_name = store_name;
      this.api_key = api_key;
      this.secret = secret;
      if (params == null) {
        params = {};
      }
      this.requestTemporaryAccessToken = bind(this.requestTemporaryAccessToken, this);
      SessionOAuth.__super__.constructor.call(this, this.store_name, this.api_key, this.secret);
      if (typeof params === 'string') {
        this.persistent_token = params;
        params = {
          persistent_token: this.persistent_token
        };
      } else {
        params = params || {};
        this.persistent_token = params.persistent_token || null;
      }
      this.params = params;
      this.registerOAuthToken(params);
    }

    SessionOAuth.prototype.onRedirectUrl = function(url, cb) {
      return url.replace(/\?code=[\w\d]+/, (function(_this) {
        return function(code) {
          var temp_token;
          temp_token = code.split('=')[1];
          return _this.requestPermanentAccessToken(temp_token, function(persistent_token) {
            _this.persistent_token = persistent_token;
            _this.registerOAuthToken();
            return process.nextTick(function() {
              return cb(_this.store_name, _this.persistent_token);
            });
          });
        };
      })(this));
    };

    SessionOAuth.prototype.requestPermanentAccessToken = function(temp_token, cb) {
      var params;
      params = "client_id=" + this.api_key + "&client_secret=" + this.secret + "&code=" + temp_token;
      return Resource.post((this.site()) + "/oauth/access_token", 'oauth', params, (function(_this) {
        return function(err, response) {
          if (err != null) {
            throw err;
            return;
          }
          response = JSON.parse(response);
          return process.nextTick(function() {
            return cb(response.access_token);
          });
        };
      })(this));
    };

    SessionOAuth.prototype.requestTemporaryAccessToken = function() {
      var scope, uri_base;
      scope = this.getScope();
      if (!scope.length) {
        this.params.onAskToken(Error("No Shopify scope defined, cannot ask for no right"));
      }
      uri_base = (this.site()) + "/oauth/authorize?client_id=" + this.api_key + "&scope=" + scope;
      if (this.params.uriForTemporaryToken) {
        return this.params.onAskToken.call(this, null, uri_base + "&redirect_uri=" + this.params.uriForTemporaryToken);
      } else {
        return this.params.onAskToken.call(this, null, uri_base);
      }
    };

    SessionOAuth.prototype.site = function() {
      return this.protocol + "://" + this.store_name + ".myshopify.com/admin";
    };

    SessionOAuth.prototype.registerOAuthToken = function(params) {
      if (this.persistent_token !== null) {
        return Resource.setOAuthToken(this.persistent_token);
      } else if (typeof this.params.onAskToken === 'function') {
        return this.requestTemporaryAccessToken();
      } else {
        throw Error("No onAskToken callback defined for getting temporary oauth2 token from Shopify, and no persistent token defined either in session");
      }
    };

    SessionOAuth.prototype.getScope = function(scope1) {
      var i, len, rights, scope, type, types;
      this.scope = scope1;
      types = ['content', 'themes', 'products', 'customers', 'orders', 'script_tags', 'shipping'];
      scope = [];
      this.scope = this.scope || this.params.scope || {};
      for (i = 0, len = types.length; i < len; i++) {
        type = types[i];
        if (!this.scope[type]) {
          continue;
        }
        if (typeof this.scope[type] === 'string') {
          this.scope[type] = this.scope[type].split(/[\/,]/);
        }
        if (Array.isArray(this.scope[type])) {
          rights = this.scope[type].map(function(right) {
            return right + "_" + type;
          });
          scope.push(rights.join(','));
        }
      }
      return scope.join(',');
    };

    return SessionOAuth;

  })(Session);

  module.exports = SessionOAuth;

}).call(this);
