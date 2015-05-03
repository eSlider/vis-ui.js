/**
 *
 * @author Andriy Oblivantsev <eslider@gmail.com>
 */
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
var onComplete = null;

function checkLoad() {
    loadedFiles++;
    if(requieredFiles.length == loadedFiles) {
        if(onComplete){
            onComplete();
        }
    }
}

function onLoadError(e) {
    console.log("Something goes wrong by load VI UI", this);
}

function loadElements(completeHandler) {
    if(completeHandler){
        onComplete  = completeHandler;
    }
    $.each(requieredFiles, function(i, fileName) {
        jQuery.getScript(fileName + "?ver=" + Math.random(), checkLoad).error(onLoadError);
    })
}

