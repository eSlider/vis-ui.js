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
     * jQueryui dialog with unholy mix of bootstrap and Mapbender custom styles
     *
     * @author Andriy Oblivantsev <eslider@gmail.com>
     * @copyright 05.11.2014 by WhereGroup GmbH & Co. KG
     */
    $.widget("vis-ui-js.popupDialog", $.ui.dialog, {
        /**
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
            // Unholy mix of jQuery UI and Bootstrap and Mapbender CSS
            var header = $('.ui-widget-header', this.uiDialog);
            $('.ui-dialog-buttonpane', this.uiDialog).addClass('modal-footer');
            header.addClass('modal-header');
            // @todo Mapbender: resolve Mapbender css dependency on generally not advantageous bootstrap .close class
            //                  to generate consistent close button vs jquerydialogextend not-really-button visuals
            $('.ui-dialog-titlebar-close', header).addClass('close');
            $('.ui-dialog-content', this.uiDialog).addClass('modal-body');
        },
        open: function() {
            this._super();
            if (this.overlay) {
                this.overlay.addClass('mb-element-modal-dialog');
            }
        },
        _createWrapper: function() {
            this._super();
            // Unholy mix of jQuery UI and Bootstrap and Mapbender CSS
            this.uiDialog.addClass('modal-content mb-element-popup-dialog');
        },
        _createButtons: function() {
            this._super();
            $('button', this.uiButtonSet).each(function() {
                $(this).addClass('button btn');
            });
        }
    });

})(jQuery);
