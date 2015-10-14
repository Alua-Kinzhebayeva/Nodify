BaseChild = require './base_child'
Metafields = require './metafield'

class CustomerAddress extends BaseChild
	parent: "/customers"
	# Because the slug/plural for address is address'e's
	slug: "addresses"
	child: "/addresses"

	constructor: (site) ->
		super(site)

	all: (params, callback) ->
		[params, callback] = [callback, params] if typeof params is 'function'
		url = @resource.queryString @prefix, params
		@resource.get url, "#{@slug}", callback

module.exports = CustomerAddress
