/*global define*/
define([
    'backbone',
    'mustache',
    'text!common-objects/templates/viewers/wrapper.html',
    'text!common-objects/templates/viewers/video.html',
    'common-objects/views/viewers/viewers-utils'
], function (Backbone, Mustache, wrapperTemplate, template, ViewersUtils) {

    'use strict';

    var supportedExtensions = ['mp4', 'mpg', 'webm', 'ogv', 'mov'];

    var ImageViewer = Backbone.View.extend({

        events: {},

        initialize: function () {
        },

        render: function (binaryResource, uuid) {

            var url = ViewersUtils.getBinaryEmbeddableUrl(binaryResource, uuid);
            var fileName = ViewersUtils.getFileName(binaryResource.fullName);

            var viewer = Mustache.render(template, {
                url: url,
                fileName: fileName
            });

            this.$el.html(Mustache.render(wrapperTemplate, {
                downloadUrl: url,
                fileName: fileName,
                id: ViewersUtils.generateViewerHash()
            }));

            this.$('.accordion-inner').append(viewer);

            return this;
        }

    });

    ImageViewer.canDisplayExtension = function (extension) {
        return _.contains(supportedExtensions, extension);
    };

    return ImageViewer;

});
