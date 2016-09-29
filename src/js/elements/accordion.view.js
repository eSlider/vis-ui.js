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
            var el = widget.element;
            var r = this._super();

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

            var id = 'accordion-group-';
            id += item.hasOwnProperty('id') ? item.id : guid();
            var group = $("<div class='group panel panel-default' id='" + id + "'/>");
            var content = $("<div class='panel-collapse collapse in'/>");
            var header = $("<div class='panel-heading header'></div>");
            var headerTitle = $("<h3 />");
            debugger;
            if(item && item.children) {

                headerTitle.html(item.title || "");
                header.append(headerTitle);
                content.append(header);


                $.each(item.children, function(i, element) {
                  var a=  content.generateElements(element);

                });

                this.refresh();
                return el;
            }


            headerTitle.html(item.title || "");
            header.append(headerTitle);
            group.append(header);
            content.append(item.html);
            group.append(content);
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