/*global define,App*/
define([
    'backbone',
    'mustache',
    'text!templates/part-permalink.html',
    'views/part-revision',
    'common-objects/views/not-found',
    'common-objects/views/prompt'
], function (Backbone, Mustache, template, PartRevisionView, NotFoundView, PromptView) {
	'use strict';

    var AppView = Backbone.View.extend({

        el: '#content',

        render: function () {
            this.$el.html(Mustache.render(template, {
                i18n: App.config.i18n
            })).show();
            this.$notifications = this.$('.notifications');
            return this;
        },

        onPartFetched:function(part){
            this.$('.part-revision').html(new PartRevisionView().render(part).$el, null);
        },

        showPartRevision:function(workspace, partNumber, partVersion){
            $.getJSON(App.config.apiEndPoint + '/shared/' +  workspace + '/parts/'+partNumber+'-'+partVersion)
                .then(this.onPartFetched.bind(this), this.onError.bind(this));
        },

        showSharedEntity:function(uuid){
            this.uuid = uuid;
            var password = this.password;
            $.ajax({
                type:'GET',
                url:App.config.apiEndPoint + '/shared/' + uuid + '/parts',
                beforeSend: function setPassword(xhr) {
                    if(password){
                        xhr.setRequestHeader('password', password);
                    }
                }
            }).then(this.onSharedEntityFetched.bind(this), this.onSharedEntityError.bind(this));
        },

        onSharedEntityFetched:function(part){
            this.$('.part-revision').html(new PartRevisionView().render(part, this.uuid).$el);
        },

        onSharedEntityError:function(err){
            if(err.status === 404){
                this.$el.html(new NotFoundView().render(err).$el);
            }
            else if(err.status === 403 && err.getResponseHeader('Reason-Phrase') === 'password-protected'){
                this.promptSharedEntityPassword();
            }
        },

        onError:function(err){
            if(err.status === 404){
                this.$el.html(new NotFoundView().render(err).$el);
            }
            else if(err.status === 403 || err.status === 401){
                window.location.href = App.config.contextPath + '?denied=true&originURL=' + encodeURIComponent(window.location.pathname + window.location.hash);
            }
        },

        promptSharedEntityPassword:function(){

            var _this = this;
            var promptView = new PromptView();
            promptView.setPromptOptions(App.config.i18n.PROTECTED_RESOURCE,
                null,App.config.i18n.OK,App.config.i18n.CANCEL, null, App.config.i18n.PASSWORD, 'password');
            window.document.body.appendChild(promptView.render().el);
            promptView.openModal();
            this.listenTo(promptView, 'prompt-ok', function (args) {
                _this.password = args[0];
                _this.showSharedEntity(_this.uuid);
            });
            this.listenTo(promptView, 'prompt-cancel', function () {
                _this.password = null;
            });
        }

    });

    return AppView;
});
