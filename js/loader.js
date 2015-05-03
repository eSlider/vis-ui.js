/**
 *
 * @author Andriy Oblivantsev <eslider@gmail.com>
 */
(function($) {
    var requieredFiles = [
        'js/utils/fn.formData.js',
        'js/elements/data.result-table.js',
        'js/elements/date.selector.js',
        'js/elements/geo.toolset.js',
        'js/elements/popup.dialog.js',
        'js/elements/tab.navigator.js',
        'js/jquery.form.generator.js'
    ];

    var loadedFiles = 0;

    function checkLoad() {
        loadedFiles++;
        if(requieredFiles.length == loadedFiles) {
            console.log("all loaded");
        }
    }

    function onLoadError(e) {
        console.log("Something goes wrong by load VI UI", this);
    }

    $.each(requieredFiles, function(i, fileName) {
        jQuery.getScript(fileName, checkLoad).error(onLoadError);
    })

})(jQuery);