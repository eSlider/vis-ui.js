(function($) {
    // fake dialogExtend check for ui-dialog
    if (!$.fn.orignalDialogFunc) {
        // sic!
        $.fn.orignalDialogFunc = $.fn.dialog;
    }
    var $doc = $(document);
    if (!$doc.data('visui-monkeypatch-uidialog')) {
        $.fn["dialog"] = function(arg1, arg2) {
            return this.hasClass('popup-dialog') ? this.popupDialog(arg1, arg2) :  this.orignalDialogFunc(arg1, arg2);
        };
        $doc.data('visui-monkeypatch-uidialog', true);
    }

    /**
     * jQuery dialog with bootstrap styles
     *
     * @author Andriy Oblivantsev <eslider@gmail.com>
     * @copyright 05.11.2014 by WhereGroup GmbH & Co. KG
     */
    $.widget("vis-ui-js.popupDialog", $.ui.dialog, {

        // track if window is opened
        isOpened: false,

        /**
         * Constructor, runs only if the object wasn't created before
         *
         * @return {*}
         * @private
         */
        _create: function() {
            var element = this.element;
            var hasDialogExtend = !!element.dialogExtend;
            element.addClass('popup-dialog');

            // overrides default options
            $.extend(this.options, {
                show: {
                    effect:   "fadeIn",
                    duration: 300
                },
                hide: {
                    effect:   "fadeOut",
                    duration: 300
                }
            });

            //resize dialog height fix
            element.bind('popupdialogresize', function(e, ui) {
                var win = $(e.target).closest('.ui-dialog');
                var height = 0;
                $.each($('> .modal-header, > .modal-body, > .modal-footer', win), function(idx, el) {
                    height += $(el).outerHeight();
                });
                win.height(Math.round(height));
                element.width(element.closest('.ui-dialog').find('> .modal-header').width());
            });

            //resize dialog height fix
            element.bind('popupdialogresizestop', function(e, ui) {
                element.width(element.closest('.ui-dialog').find('> .modal-header').width());
            });

            // prevent key listening outside the dialog
            element.on('keydown', function(e) {
                e.stopPropagation();
            });

            this._super();

            if (hasDialogExtend) {
                // NOTE: no widget-level options defaults for these
                var extendableOptions = $.extend(true, {
                    closable:    true,
                    maximizable: true,
                    collapsable: true
                }, this.options);

                element.data("ui-dialog",true);
                element.dialogExtend(extendableOptions);
                if (extendableOptions.maximizable) {
                    $('.ui-dialog-titlebar, .ui-dialog.title', this.element.closest('.ui-dialog')).dblclick(function() {
                        if (element.dialogExtend('state') === 'normal'){
                            element.dialogExtend('maximize');
                        }else{
                            element.dialogExtend('restore');
                        }
                    });
                }
            }
        },

        /**
         * Overrides default open method, but adds some Bootstrap classes to the dialog
         * @return {}
         */
        open: function() {
            if(this.isOpened){
                return
            }
            this.isOpened = true;

            var content = $(this.element);
            var dialog = content.closest('.ui-dialog');
            var header = $('.ui-widget-header', dialog);
            var closeButton = $('.ui-dialog-titlebar-close', header);
            var dialogBody = $('.ui-dialog-content', dialog);
            var dialogBottomPane = $('.ui-dialog-buttonpane', dialog);
            var dialogBottomButtons = $('.ui-dialog-buttonset > .ui-button', dialogBottomPane);

            // Marriage of jQuery UI and Bootstrap
            dialog.addClass('modal-content');
            dialogBottomPane.addClass('modal-footer');
            dialogBottomButtons.addClass('button');
            header.addClass('modal-header');
            closeButton.addClass('close');
            dialogBody.addClass('modal-body');

            // Set as mapbender element
            dialog.addClass('mb-element-popup-dialog');
            dialogBottomButtons.addClass('btn');

            // Fix switch between windows
            if(dialog.css('z-index') == "auto"){
                dialog.css('z-index',1);
            }

            this._super();
            if (this.overlay) {
                this.overlay.addClass('mb-element-modal-dialog');
            }
        }
    });

})(jQuery);
