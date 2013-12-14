
'use strict'

var streamHandlerConvert = {
  handlerType: 'stream handler',
  configKey: 'quiverStreamHandlers',
  toHandlerMethod: 'toStreamHandler',

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

module.exports = {
  streamHandlerConvert: streamHandlerConvert,
  httpHandlerConvert: httpHandlerConvert,
  handleableHandlerConvert: handleableHandlerConvert,
  handlerConvertTable: handlerConvertTable
}