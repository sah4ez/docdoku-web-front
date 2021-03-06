/*global define*/
define(function(){

    'use strict';
    return {

        bytesToSize: function(bytes){
            var sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

            if (bytes === 0){
                return 'n/a';
            }

            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

            if (i === 0) {
                return (bytes / Math.pow(1024, i)) + ' ' + sizes[i];
            }

            return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
        },

        diskUsageTooltip:function(key,value){
            return '<h3>'+key+'</h3>' + '<p>'+value+'</p>';
        }
    };

});
