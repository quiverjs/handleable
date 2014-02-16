
'use strict'

var safeCallbackLib = require('quiver-safe-callback')
var safeCallback = safeCallbackLib.safeCallback
var safeAsyncFunction = safeCallbackLib.safeAsyncFunction

var makeExtensible = function(handler) {
  Object.defineProperty(handler, '__extensible', {
    enumerable: false,
    writable: true,
    value: true
  })
}

var isExtensible = function(handler) {
  return handler.__extensible && 
    !Object.prototype.propertyIsEnumerable.call(handler, '__extensible')
}

var extendHandleable = function(originalHandleable, extendHandleable) {
  var newHandleable = Object.create(null)

  for(var key in originalHandleable) {
    if(isExtensible(originalHandleable[key])) {
      newHandleable[key] = originalHandleable[key]
    }
  }

  for(var key in extendHandleable) {
    newHandleable[key] = extendHandleable[key]
  }

  return newHandleable
}

var streamHandlerConvert = {
  handlerType: 'stream handler',
  configKey: 'quiverStreamHandlers',
  toHandlerMethod: 'toStreamHandler',
  handlerArity: 3,

  handleableToHandler: function(handleable) {
    if(handleable.toStreamHandler) {
      return handleable.toStreamHandler()
    }

    return null
  },

  handlerToHandleable: function(streamHandler) {
    var handleable = {
      toStreamHandler: function() {
        return streamHandler
      }
    }

    return handleable
  }
}

var httpHandlerConvert = {
  handlerType: 'http handler',
  configKey: 'quiverHttpHandlers',
  toHandlerMethod: 'toHttpHandler',
  handlerArity: 3,

  handleableToHandler: function(handleable) {
    if(handleable.toHttpHandler) {
      return handleable.toHttpHandler()
    }

    return null
  },

  handlerToHandleable: function(httpHandler) {
    var handleable = {
      toHttpHandler: function() {
        return httpHandler
      }
    }

    return handleable
  }
}

var handleableHandlerConvert = {
  handlerType: 'handleable',
  configKey: 'quiverHandleables',

  handleableToHandler: function(handleable) {
    return handleable
  },

  handlerToHandleable: function(handleable) {
    return handleable
  }
}

var handlerConvertTable = {
  'stream handler': streamHandlerConvert,
  'http handler': httpHandlerConvert,
  'handleable': handleableHandlerConvert
}

var handlerBuilderToHandleableBuilder = function(handlerBuilder, handlerConvert) {
  var handlerArity = handlerConvert.handlerArity

  var handleableBuilder = function(config, callback) {
    handlerBuilder(config, safeCallback(function(err, handler) {
      if(err) return callback(err)

      if(handlerArity > 0) {
        handler = safeAsyncFunction(handler, handlerArity)
      }

      var handleable = handlerConvert.handlerToHandleable(handler)
      callback(null, handleable)
    }))
  }

  return handleableBuilder
}

module.exports = {
  isExtensible: isExtensible,
  makeExtensible: makeExtensible,
  extendHandleable: extendHandleable,
  streamHandlerConvert: streamHandlerConvert,
  httpHandlerConvert: httpHandlerConvert,
  handleableHandlerConvert: handleableHandlerConvert,
  handlerConvertTable: handlerConvertTable,
  handlerBuilderToHandleableBuilder: handlerBuilderToHandleableBuilder
}