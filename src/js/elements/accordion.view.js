/**
 * Created by ransomware on 28/09/16.
 */
(function($) {

    /**
     * jQuery tabs with bootstrap styles
     */
    $.widget("vis-ui-js.accordionView", $.ui.accordion, {
        options: {
            collapsible: true
        },
        _create: function() {
            var widget = this;
            var options = widget.options;

            this.options.header = '.header';

            // TODO: add classes for theming
            if(this.options.classes) {
                /**
                 this.options.classes["ui-accordion-header"] = "";
                 this.options.classes["ui-accordion-header-collapsed"] = "";
                 this.options.classes["ui-accordion-content"] = "";
                 * */
            } else {
                /*
                 this.options.classes = {
                 "ui-accordion-header":           "",
                 "ui-accordion-header-collapsed": "",
                 "ui-accordion-content":          ""
                 };
                 * **/
            }

            var el = widget.element;
            this._super();

            el.addClass('mapbender-element-accordion-view');

            if(options && options.children) {
                $.each(options.children, function() {
                    widget._add(this);
                });
            }

        },

        close: function(uuid) {

        },

        closeAll: function() {

        },
        _add:     function(item) {

            var el = this.element;

            var id = 'accordion-group-' + (item.hasOwnProperty('id') ? item.id : guid());

            var header = $("<h3 class='ui-accordion-header header'></h3>");
            var group = $("<div class='group ui-accordion-content' id='" + id + "'/>");

            header.html(item.title || "");
            group.append(item.html);

            el.append(header);
            el.append(group);

            this.refresh();
            return el;
        },

        add: function(title, htmlElement, activate) {
            var content = this._add({
                html:  htmlElement,
                title: title
            });

            return content;
        }
    });

    var guid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
    })();
})(jQuery);