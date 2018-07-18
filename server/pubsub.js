'use strict';
//Writing pubsub module for socket.io
module.exports = {
    //Publishing a event..
    publish: function (socket, options) {
        if (options) {
            var collectionName = options.collectionName;
            var method = options.method;
            var data = options.data;
            var modelId = options.modelId;
            if (method === 'POST') {
                //console.log('Posting new data');
                var name = '/' + collectionName + '/' + method;
                socket.emit(name, data);
            }
            else {
                var name = '/' + collectionName + '/' + modelId + '/' + method;
                socket.emit(name, data);
            }
        } else {
            throw 'Error: Option must be an object type';
        }
    }, //End Publish..

    isEmpty: function (obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        // null and undefined are "empty"
        if (obj == null) return true;
        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;
        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (this.hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    } //isEmpty function..
}