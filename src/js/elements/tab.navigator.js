(function($) {

    /**
     * jQuery tabs with bootstrap styles
     */
    $.widget("vis-ui-js.tabNavigator", $.ui.tabs, {
        options: {
        },
        _create: function() {
            var widget = this;
            var options = widget.options;
            var el = widget.element;
            var ul = $('<ul class="nav nav-tabs" role="tablist"/>');

            el.append(ul);


            //var wrapper = navigation.closest('.ui-tabs');
            el.addClass('mapbender-element-tab-navigator');

            if(options.hasOwnProperty('children')){
                $.each(options.children,function(){
                    var $tab = widget._add(this);
                    $tab.data('item', this);
                });
                el.on('tabnavigatoractivate',function(e,ui) {
                    var item = $(ui.newTab).data('item');
                    if(item.hasOwnProperty('active')){
                        item.active(e,ui);
                    }
                });
            }

            return this._super();
        },

        _add: function (item){
            var $panel = $("<div>")
                .uniqueId()
                .addClass('tab-content')
                .append(item.html)
            ;
            var $anchor = $('<a>')
                .attr('href', '#' + $panel.attr('id'))
                .text(item.title)
            ;
            var $tab = $('<li>')
                .append($anchor)
            ;

            this._getList().append($tab);
            this.element.append($panel);
            return $tab;
        },

        add: function(title, htmlElement, activate) {
            var content = this._add({
                html:  htmlElement,
                title: title
            });
            if(activate) {
                this.option('active', this.size() - 1);
            }
            this.refresh();
            return content;
        },

        size: function() {
            return this.tabs.length;
        }
    });
})(jQuery);
