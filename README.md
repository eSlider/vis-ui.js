VIS-UI-JS
=========

Shim repository for [Bootstrap](http://getbootstrap.com).

This package just provides the basic JavaScript UI generator in the package. This
means that although the stylesheets are there, you will be required to provide
your own means of including the styles.

Elements
--------

Basic usage:
```javascript

var $div = $("<div/>");
$div.generateElements({children:[{
    type:  'input',
    title: "Input",
    placeholder: "placeholder value",
    mandatory: true
},{
    type:  'input',
    name: "input2",
    title: "Input #2",
    placeholder: "placeholder value #2"
}]});

$div.popupDialog({
    title:       "Demo",
    maximizable: true,
    buttons:     [{
        text:  "OK",
        click: function(e) {
            var div = $(e.currentTarget).closest(".ui-dialog").find(".popup-dialog");
            div.popupDialog('close');
        }
    }]
});
```


Package Managers
----------------

* [Composer](http://packagist.org/packages/viscreation/vis-ui-js): `viscreation/vis-ui-js`
