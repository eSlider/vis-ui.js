/**
 *
 * @author Andriy Oblivantsev <eslider@gmail.com>
 * @copyright 08.04.2015 by WhereGroup GmbH & Co. KG
 */
(function($) {

    /**
     * Event list
     * @type {string[]}
     */
    var eventNameList = [
        'load',
        'focus', 'blur',
        'input', 'change', 'paste',
        'click', 'dblclick', 'contextmenu',
        'keydown', 'keypress', 'keyup',
        'dragstart','ondrag','dragover','drop',
        'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'touchstart', 'touchmove', 'touchend','touchcancel'
    ];

    // extend jquery to fire event on "show" and "hide" calls
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });

    /**
     * Check if object has a key
     *
     * @param obj
     * @param key
     * @returns {boolean}
     */
    function has(obj, key) {
        return typeof obj[key] !== 'undefined';
    }

    function genElement_(declarations, item) {
        var type = has(declarations, item.type) ? item.type : 'html';
        // Use declarations object as this argument for handler function.
        // Do not "beautify" this into discrete assignment of callable to variable followed by invocation, because
        // THAT passes nothing of particular interest as the invoked method's this arg.
        // see https://ecma-international.org/ecma-262/5.1/#sec-4.3.27
        var element = (declarations[type])(item);

        if(has(item, 'cssClass')) {
            element.addClass(item.cssClass);
        }

        if(has(item, 'attr')) {
            $.each(item.attr, function(key, val) {
                element.attr(key,val);
            });
        }

        if(typeof item == "object") {
            addEvents(element, item);
        }

        if(has(item, 'css')) {

            element.css(item.css);
        }

        element.data('item', item);

        if(has(item, 'mandatory')){
            element.addClass('has-warning');
        }

        return element;
    }

    function genElements_(declarations, items) {
        var items_;
        if (!_.isArray(items)) {
            // @todo: warn, deprecate
            items_ = _.toArray(items);
        } else {
            items_ = items;
        }
        var elements = [];
        for (var i = 0; i < items_.length; ++i) {
            elements.push(genElement_(declarations, items_[i]));
        }
        return elements;
    }
    /**
     * Add jquery events to element y declration
     *
     * @param element
     * @param declaration
     */
    function addEvents(element, declaration) {
        $.each(declaration, function(k, value) {
            if(typeof value == 'function') {
                element.on(k, value);
            } else if(typeof value == "string" && _.contains(eventNameList, k)) {
                var elm = element;
                if(elm.hasClass("form-group")) {
                    elm = elm.find("input,.form-control");
                }
                if(k === 'load'){
                    setTimeout(function(){
                        $(elm).ready(function(e) {
                            var el = elm;
                            var result = false;
                            console.error("Using Javascript code in the configuration is deprecated",value);
                            eval(value);
                            result && e.preventDefault();
                            return result;
                        });
                    },1);
                }else{
                    elm.on(k, function(e) {
                        var el = $(this);
                        var result = false;
                        console.error("Using Javascript code in the configuration is deprecated",value);
                        eval(value);
                        result && e.preventDefault();
                        return result;
                    });
                }
            }
        });
    }

    // Copies a string to the clipboard. Must be called from within an
    // event handler such as click. May return false if it failed, but
    // this is not always possible. Browser support for Chrome 43+,
    // Firefox 42+, Safari 10+, Edge and IE 10+.
    // IE: The clipboard feature may be disabled by an administrator. By
    // default a prompt is shown the first time the clipboard is
    // used (per session).
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    // NOTE: bad indents deliberate to minimize diff
    var defaultDeclarations = {
            popup: function(item) {
                var popup = $("<div/>");
                popup.append(genElements_(this, item.children || []));
                window.setTimeout(function() {
                    popup.popupDialog(item)
                }, 1);

                return popup;
            },
            form: function(item) {
                var form = $('<form/>');
                form.append(genElements_(this, item.children || []));
                return form;
            },
            fluidContainer: function(item) {
                var container = $('<div class="container-fluid"/>');
                var hbox = $('<div class="row"/>');
                hbox.append(genElements_(this, item.children || []));
                container.append(hbox);
                return container;
            },
            inline: function(item) {
                var container = $('<div class="form-inline"/>');
                container.append(genElements_(this, item.children || []));
                return container;
            },
            html: function(item) {
                var container = $('<div class="html-element-container"/>');
                if (typeof item === 'string'){
                    container.html(item);
                }else if(has(item,'html')){
                    container.html(item.html);
                }else{
                    container.html(JSON.stringify(item));
                }
                return container;
            },
            button: function(item) {
                var title = has(item, 'title') ? item.title : 'Submit';
                var button = $('<button class="btn button">' + title + '</button>');
                button.attr("title", title);
                return button;
            },
            submit: function(item) {
                var button = this.button(item);
                button.attr('type', 'submit');
                return button;
            },
            /**
             * WRAPS the passed input into a form group
             *
             * @param {Object} item
             * @param {jQuery} [input] manufactures a new text-type input if omitted
             * @return {*|jQuery|HTMLElement}
             */
            input: function(item, input) {
                var inputField = input;
                if (!input) {
                    var type = item.type || 'text';
                    inputField = $('<input class="form-control" type="' + type + '"/>');
                }
                var container = $('<div class="form-group"/>');

                inputField.data('declaration',item);

                $.each(['name', 'rows', 'placeholder'], function(i, key) {
                    if(has(item, key)) {
                        inputField.attr(key, item[key]);
                    }
                });

                if(has(item, 'value')) {
                    inputField.val(item.value);
                }

                if(has(item, 'disabled') && item.disabled) {
                    inputField.attr('disabled','');
                }


                if(has(item, 'title')) {
                    container.append(this.label(item));
                    container.addClass('has-title')
                }

                if(has(item, 'mandatory') && item.mandatory) {
                    inputField.data('warn',function(value){
                        var hasValue = $.trim(value) != '';
                        var isRegExp = item.mandatory !== true;

                        if(isRegExp){
                            console.error("Using Javascript code in the configuration is deprecated",item.mandatory);
                            hasValue = eval(item.mandatory).exec(value) != null;
                        }

                        if(hasValue){
                            container.removeClass('has-error');
                        }else{
                            if(inputField.is(":visible")){
                                var text = item.hasOwnProperty('mandatoryText')? item.mandatoryText: "Please, check!";
                                $.notify( inputField, text, { position:"top right", autoHideDelay: 2000});
                            }
                            container.addClass('has-error');
                        }
                        return hasValue;
                    });
                }

                if(has(item, 'infoText')) {
                    var infoButton = $('<a class="infoText"></a>');
                    infoButton.on('click touch press',function(e){
                       var button = $(e.currentTarget);
                        $.notify(button.attr('title'),'info');
                    });
                    infoButton.attr('title', item.infoText);
                    container.append(infoButton);
                }


                if(has(item, 'copyClipboard')) {

                    var copyButton = $('<a class="copy-to-clipboard"><i class="fa fa-clipboard far-clipboard" aria-hidden="true"></i></a>');
                    copyButton.on('click', function(e) {
                        var data = container.formData(false);
                        copyToClipboard(data[item.name]);
                    });
                    container.append(copyButton);
                }

                container.append(inputField);

                return container;
            },
            label: function(item) {
                var label = $('<label/>');
                if(_.has(item, 'text')) {
                    label.html(item.text);
                }
                if(_.has(item, 'title')) {
                    label.html(item.title);
                }
                if(_.has(item, 'name')) {
                    label.attr('for', item.name);
                }
                return label;
            },
            checkbox: function(item, input) {
                var container = $('<div class="form-group checkbox"/>');
                var label = $('<label/>');

                input = input ? input : $('<input type="checkbox"/>');

                input.data('declaration',item);

                label.append(input);

                if(has(item, 'name')) {
                    input.attr('name', item.name);
                }

                if(has(item, 'value')) {
                    input.val(item.value);
                }

                if(has(item, 'title')) {
                    label.append(item.title);
                }

                if(has(item, 'checked') && item.checked) {
                    input.attr('checked', "checked");
                }

                if(has(item, 'mandatory') && item.mandatory) {
                    input.data('warn',function(){
                        var isChecked = input.is(':checked');
                        if(isChecked){
                            container.removeClass('has-error');
                        }else{
                            container.addClass('has-error');
                            if(input.is(':visible')){
                                var text = item.hasOwnProperty('mandatoryText') ? item.mandatoryText : "Please confirm!";
                                $.notify( input, text, { position:"top left", autoHideDelay: 2000});
                            }

                        }
                        return isChecked;
                    });
                }

                container.append(label);

                if(has(item, 'infoText')) {
                    var infoButton = $('<a class="infoText">Info</a>');
                    infoButton.attr('title', item.infoText);
                    container.append(infoButton);
                }

                return container;
            },
            radio: function(item) {
                var input = $('<input type="radio"/>');
                var container = this.checkbox(item, input);
                container.addClass('radio');
                return container;
            },
            formGroup: function(item) {
                var container = $('<div class="form-group"/>');
                container.append(genElements_(this, item.children || []));
                return container;
            },
            textArea: function(item) {
                var inputField = $('<textarea class="form-control" rows="3"/>');
                var container = this.input(item, inputField);
                container.addClass('textarea-container');

                inputField.data('declaration',item);
                return container;
            },
            select: function(item) {
                var select = $('<select class="form-control"/>');
                var container = this.input(item, select);
                var value = has(item, 'value') ? item.value : null;

                container.addClass('select-container');

                if(has(item, 'multiple') && item.multiple) {
                    select.attr('multiple', 'multiple');
                }

                if(has(item, 'options')) {
                    var isValuePack = _.isArray(_.first(item.options)) && _.size(_.first(item.options)) == 2;
                    _.each(item.options, function(title, value) {
                        if(isValuePack) {
                            value = title[0];
                            title = title[1];
                        } else if(_.isObject(title)) {
                            var a = _.toArray(title);
                            value = a[0];
                            title = a[1];
                        }

                        var option = $("<option/>");
                        option.attr('value', value);
                        option.html(title);
                        select.append(option);
                    });
                }
                select.val(value);
                if ((item.multiple || item.select2) && (typeof select.select2 === 'function')) {
                    select.select2(item);
                }

                return container;
            },
            image: function(item) {
                var image = $('<img src="' + (has(item, 'src') ? item.src : '') + '"/>');
                var subContainer = $("<div class='sub-container'/>");
                var container = this.input(item, image);

                container.append(subContainer.append(image.detach()));
                container.addClass("image-container");

                if(has(item, 'enlargeImage') && item.enlargeImage) {
                    image.attr('tabindex', 0);
                    image.css('cursor', 'pointer');
                    image.on('keypress click', function(e) {
                        if(e.type !== 'click' && e.which && e.which !== 13) {
                            return
                        }

                        var bigImage = new Image();
                        bigImage.src = item.src;
                        bigImage.onload = function() {
                            var dialog = $('<div>');
                            var bImage = $('<img src="' + image.attr('src') + '"/>');
                            var _popupConfig = {
                                title: image.title ? image.title : 'Image',
                                width: bigImage.width
                            };
                            var maxHeight = $(window).height() - 100;
                            if(bigImage.height > maxHeight) {
                                _popupConfig.height = maxHeight;
                            }
                            dialog.popupDialog(_popupConfig);
                            bImage.css({
                                height:      'auto',
                                width:       '100%',
                                'max-width': bigImage.width
                            });
                            dialog.append(bImage);
                        };
                    })
                }

                if(has(item, 'imageCss')) {
                    image.css(item['imageCss']);
                } else {
                    image.css({width: "100%"});
                }
                return container;
            },
            file: function(item) {
                var input = $('<input type="hidden"  />');
                var fileInput = $('<input type="file" />');
                var container = this.input(item, input);
                var defaultText = (has(item, 'text') ? item.text : "Select");
                var textSpan = '<span class="upload-button-text"><i class="fa fa-upload" aria-hidden="true"/> ' + defaultText + '</span>';
                var uploadButton = $('<span class="btn btn-success button fileinput-button">' + textSpan + '</span>');
                var buttonContainer = $("<div/>");
                var progressBar = $("<div class='progress-bar'/>");
                var eventHandlers = item.on ? item.on : {};

                if(has(item, 'accept')) {
                    fileInput.attr('accept', item.accept);
                }

                //input.detach();
                container.addClass("file-container");
                uploadButton.append(fileInput);
                buttonContainer.append(uploadButton);
                uploadButton.append(progressBar);
                container.append(buttonContainer);

                function truncate(n, len) {
                    var ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
                    var filename = n.replace('.' + ext, '');
                    if(filename.length <= len) {
                        return n;
                    }
                    filename = filename.substr(0, len) + (n.length > len ? '[...]' : '');
                    return filename + '.' + ext;
                }

                fileInput.fileupload({
                    dataType:    'json',
                    url:         item.uploadHanderUrl,
                    formData:    item.formData,
                    //sequentialUploads: true,
                    add:         function(e, data) {
                        //console.log("added file", data, e);
                        data.submit();
                    },
                    progressall: function(e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        progressBar.css({width: progress + "%"});
                        //progressBar.html(progress + "%");
                        if(eventHandlers.progressall){
                            console.error("Using Javascript code in the configuration is deprecated",eventHandlers.progressall);
                            eval(eventHandlers.progressall);
                        }
                    },
                    always:      function(e, data) {
                        if(eventHandlers.always) {
                            console.error("Using Javascript code in the configuration is deprecated",eventHandlers.always);
                            eval(eventHandlers.always);
                        }
                    },
                    done:        function(e, data) {
                        if(eventHandlers.done){
                            console.error("Using Javascript code in the configuration is deprecated",eventHandlers.done);
                            eval(eventHandlers.done);
                        }
                        progressBar.css({width: 0});
                    },
                    success:     function(result, textStatus, jqXHR) {
                        if(eventHandlers.success){
                            console.error("Using Javascript code in the configuration is deprecated",eventHandlers.success);
                            eval(eventHandlers.success);
                        }

                        if(result.files && result.files[0]) {
                            var fileInfo = result.files[0];
                            var img = container.closest('form').find('img[name="' + item.name + '"]');

                            if(fileInfo.error) {
                                $.notify(fileInfo.error, "error");
                                return;
                            }

                            if(fileInfo.name) {
                                buttonContainer.find('.upload-button-text').html('<i class="fa fa-check-circle-o far-check-circle" aria-hidden="true"/> ' + truncate(fileInfo.name, 10));
                                var newUploadFileInput = container.find('input[type="file"]')
                                    .attr('title', fileInfo.name)
                                    .attr('alt', fileInfo.name)
                                    .attr('label', fileInfo.name);
                            }

                            if(img.size()){
                                img.attr('src', fileInfo.thumbnailUrl);
                            }
                            input.val(fileInfo.url);
                        }
                    }
                });

                return container;
            },
            tabs: function(item) {
                var container = $('<div/>');
                var declarations = this;
                var tabs = [];
                if(has(item, 'children') ) {
                    $.each(item.children, function(k, subItem) {
                        var htmlElement = genElement_(declarations, subItem);
                        var tab = {
                            html: htmlElement
                        };

                        if(has(subItem, 'title')) {
                            tab.title = subItem.title;
                        }
                        tabs.push(tab);
                    });
                }
                container.tabNavigator({children: tabs});
                return container;
            },
            fieldSet: function(item) {
                var fieldSet = $("<fieldset class='form-group'/>");

                if (item.title) {
                    fieldSet.append(this.label(item));
                }
                if(has(item, 'legend')) {
                    fieldSet.append("<legend>"+item.legend+"</legend>");
                }
                fieldSet.append(genElements_(this, item.children || []));

                if (item.breakLine) {
                    fieldSet.append(this.breakLine(item));
                }

                return fieldSet;
            },
            date: function(item) {
                var inputHolder = this.input(item);
                var input = inputHolder.find('> input');
                input.dateSelector(item);
                return inputHolder;
            },
            colorPicker: function(item) {
                var container = $('<div class="form-group"/>');
                var inputHolder = this.input(item);
                var label = inputHolder.find('> label');

                inputHolder.append('<span class="input-group-addon"><i></i></span>');
                inputHolder.addClass("input-group colorpicker-element colorpicker-component");
                container.prepend(label);
                container.append(inputHolder);
                inputHolder.find('> label').remove();

                if (item.value) {
                    item.color = item.value;
                }

                if(!item.hasOwnProperty("format")){
                    item.format = "hex";
                }

                inputHolder.colorpicker(item);

                var input = inputHolder.find("input");
                input.addClass("form-control");

                return container;
            },
            slider: function(item) {
                var container = $('<div class="form-group input-group slider-holder"/>');
                var inputHolder = this.input(item);
                var label = inputHolder.find('> label');
                var input = inputHolder.find('> input');
                var sliderRange = $('<div class="input-group"/>');

                label.append('<span/>')

                inputHolder.prepend(sliderRange);
                inputHolder.find('> label').remove();
                inputHolder.find('> input').attr('type', 'hidden');

                container.prepend(label);
                container.append(inputHolder);

                label.find('> span').text(' ' + item.value);

                sliderRange.slider($.extend({
                    range:  "max",
                    min:    1,
                    max:    10,
                    value:  1,
                    step:   1,
                    slide:  function(event, ui) {
                        input.val(ui.value);
                        label.find('> span').text(' ' + ui.value);
                    },
                    change: function(event, ui) {
                        var value = input.val();
                        label.find('> span').text(' ' + value);
                    }
                }, item));

                input.on('change', function() {
                    var value = input.val();
                    label.find('> span').text(' ' + value);
                    sliderRange.slider("value", value);
                });

                return container;
            },
            resultTable: function(item) {
                var container = $("<div/>");
                $.each(['name'], function(i, key) {
                    if(has(item, key)) {
                        container.attr(key, item[key]);
                    }
                });

                return container
                    .data('declaration', item)
                    .resultTable($.extend({
                        lengthChange: false,
                        pageLength:   10,
                        searching:    false,
                        info:         true,
                        processing:   false,
                        ordering:     true,
                        paging:       true,
                        selectable:   false,
                        autoWidth:    false
                    }, item));
            },
            digitizingToolSet: function(item) {
                var $div = $("<div/>");
                $div.data('declaration',item);
                return $div.digitizingToolSet(item);
            },

            /**
             * Break line
             *
             * @param item
             * @return {*|HTMLElement}
             */
            breakLine: function(item) {
                return $("<hr class='break-line'/>");
            },

            /**
             *
             * @param item
             */
            text: function(item) {
                var text = $('<div class="text"/>');
                var container = this.input(item, text);
                container.addClass('text');
                return container;
            },

            /**
             * Simple container
             *
             * @param item
             */
            container: function(item) {
                var container = $('<div class="form-group"/>');
                container.append(genElements_(this, item.children || []));
                return container;
            },

            /**
             * Simple accordion
             *
             * @param item
             */
            accordion: function(item) {
                var declarations = this;
                var container = $('<div class="accordion"/>');
                if(has(item, 'children')) {
                    _.each(item.children, function(child, k) {
                        var pageContainer = $("<div class='container' data-id='" + k + "'/>");
                        var pageHeader = $("<h3 class='header' data-id='" + k + "'/>");

                        if(has(child, 'head')) {
                            pageHeader.append(genElement_(declarations, child.head));

                            // if(has(child.head, 'title')) {
                            //     pageHeader.append(widget.label(headItem));
                            // }
                            //
                            // if(has(child.head, 'children')) {
                            //     _.each(child.head.children, function(headItem) {
                            //         pageHeader.append(widget.genElement(headItem));
                            //     })
                            // }
                        }

                        if(has(child, 'content')) {
                            pageContainer.append(genElement_(declarations, child.content));
                        }

                        container.append(pageHeader);
                        container.append(pageContainer);
                    })
                }
                container.data('declaration', item);
                container.accordion(item);
                return container;
            }
    };
    $.widget('vis-ui-js.generateElements', {
        options:      {},
        /**
         * Constructor
         *
         * @private
         */
        _create:      function() {
            this._setOptions(this.options);
        },

        /**
         * Generate element by declaration
         *
         * @param item declaration
         * @return jquery html object
         */
        genElement: function(item) {
            return genElement_(this.declarations, item);
        },

        /**
         * Generate elements
         *
         * @param element jQuery object
         * @param children declarations
         */
        genElements: function(element, children) {
            element.append(genElements_(this.declarations, children));
        },

        /**
         * Set options
         *
         * @param options
         * @private
         * @todo: this should be _create (minus options argument)
         */
        _setOptions: function(options) {
            // always deep-copy to prevent monkey-patches affecting other instances
            this.declarations = $.extend({}, defaultDeclarations, options.declarations);
            if (options.type && !options.children) {
                console.warn("Invocation of generateElements (plural!) with single item is deprecated. Put your item in a list and pass it in the children property.");
                this.genElements(this.element, [options]);
            } else if(has(options, 'children')) {
                this.genElements(this.element, options.children);
            }

            this.element.addClass('vis-ui');
            this._super(options);
            this.refresh();
        },

        /**
         * Refresh generated elements
         */
        refresh:     function() {
            this._trigger('refresh');
        }
    });

    /**
     * Update existing select element
     *
     * @param values
     * @param idKey
     * @param valueKey
     */
    $.fn.updateSelect = function(values, idKey, valueKey) {
        var select = this;
        var val = select.val();
        select.empty();

        if(idKey && valueKey){
            values = _.object(_.pluck(values, idKey), _.pluck(values, valueKey));
        }

        _.each(values, function(value, key) {
            select.append('<option value="'+key+'">'+value+'</option>');
        });

        select.val(val);
    };

    /**
     * Grabbed from here: http://jsfiddle.net/DkHyd/
     */
    $.fn.togglepanels = function(args) {
        return this.each(function() {
            $(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset")
                .find("h3")
                .addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom")
                .hover(function() {
                    $(this).toggleClass("ui-state-hover");
                })
                .prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>')
                .click(function(e) {
                    $(this)
                        .toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom")
                        .find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end()
                        .next().slideToggle(0);

                    if(args.onChange) {
                        var title = $(e.currentTarget);
                        args.onChange(e, {
                            'title':   title,
                            'content': title.next()
                        });
                    }
                    return false;
                })
                .next()
                .addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom")
                .hide();
        });
    };

})(jQuery);
