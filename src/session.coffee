crypto = require 'crypto'
Blog = require './resources/blog'
Product = require './resources/product'
Order = require './resources/order'
ApplicationCharge = require './resources/application_charge'
Article = require './resources/article'
Checkout = require './resources/checkout'
Collect = require './resources/collect'
Comment = require './resources/comment'
Country = require './resources/country'
CustomCollection = require './resources/custom_collection'
Customer = require './resources/customer'
CustomerGroup = require './resources/customer_group'
CustomerSavedSearch = require './resources/customer_saved_search'
Event = require './resources/event'
Fulfillment = require './resources/fulfillment'
Page = require './resources/page'
ProductImage = require './resources/product_image'
ProductSearchEngine = require './resources/product_search_engine'
ProductVariant = require './resources/product_variant'
Province = require './resources/province'
RecurringApplicationCharge = require './resources/recurring_application_charge'
Redirect = require './resources/redirect'
Refund = require './resources/refund'
ScriptTag = require './resources/script_tag'
Shop = require './resources/shop'
SmartCollection = require './resources/smart_collection'
Theme = require './resources/theme'
Transaction = require './resources/transaction'
Webhook = require './resources/webhook'

trim = (string) ->
  string.replace(/^\s\s*/, '').replace(/\s\s*$/, '')

empty = (string)->
  string = trim(string)
  string.length is 0

sortObj = (o) ->
  sorted = {}
  a = []

  for key of o
    if o.hasOwnProperty key
      a.push key

  a.sort()

  for key in [0..a.length]
    sorted[a[key]] = o[a[key]]

  return sorted

isNumeric = (n) ->
  !isNaN(parseFloat(n)) and isFinite(n)


class Session

  protocol: "https"

  constructor: (@url, @apiKey, @secret, @params = {}) ->

    if @params['signature']?
      timestamp = (new Date(@params['timestamp'])).getTime()
      expireTime = (new Date).getTime() - (24 * 84600)
      if not @validateSignature(@params) and expireTime > timestamp
        throw new Error 'Invalid signature: Possible malicious login.'

    @url = @prepareUrl(@url)

    if @valid
      @blog = new Blog(@site())
      @product = new Product(@site())
      @order = new Order(@site())
      @applicationCharge = new ApplicationCharge(@site())
      @article = new Article(@site())
      @checkout = new Checkout(@site())
      @collect = new Collect(@site())
      @comment = new Comment(@site())
      @country = new Country(@site())
      @customCollection = new CustomCollection(@site())
      @customer = new Customer(@site())
      @customerGroup = new CustomerGroup(@site())
      @customerSavedSearch = new CustomerSavedSearch(@site())
      @event = new Event(@site())
      @fulfillment = new Fulfillment(@site())
      @page = new Page(@site())
      @productImage = new ProductImage(@site())
      @productSearchEngine = new ProductSearchEngine(@site())
      @productVariant = new ProductVariant(@site())
      @province = new Province(@site())
      @recurringApplicationCharge = new RecurringApplicationCharge(@site())
      @redirect = new Redirect(@site())
      @refund = new Refund(@site())
      @scriptTag = new ScriptTag(@site())
      @shop = new Shop(@site())
      @smartCollection = new SmartCollection(@site())
      @theme = new Theme(@site())
      @transaction = new Transaction(@site())
      @webhook = new Webhook(@site())

  createPermissionUrl: ->
    "http://#{@url}/admin/api/auth?api_key=#{@apiKey}" if not empty(@url) and not empty(@apiKey)

  site: ->
    "#{@protocol}://#{@apiKey}:#{@secret}@#{@url}/admin"

  valid: ->
    not empty(@url)

  prepareUrl: (url) ->
    return '' if empty(url)
    url.replace /https?:\/\//, ''
    url += '.myshopify.com' unless url.indexOf(".") isnt -1
    return url

  validateSignature: (params) ->
    @signature = params['signature']
    generatedSignature = @secret
    params = sortObj(params)
    for k, v of params
      if k isnt "signature" and k isnt "action" and k isnt "controller" and not isNumeric(k) and k?
        generatedSignature += "#{k}=#{v}"

    generatedSignature = generatedSignature.replace(new RegExp("undefined=undefined"), '')
    generatedSignature = crypto.createHash('md5').update("#{generatedSignature}").digest("hex")
    generatedSignature is @signature







module.exports = Session
