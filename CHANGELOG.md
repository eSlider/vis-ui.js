# 0.1.18 (WIP)
* Add `vis-ui` CSS class to all top-level generated items to allow more specifically guided CSS rules
* Support passing 'declarations' object to override generateElements individual tag-generating functions
* Support passing already constructed dom nodes as child elements, these will be appended without modification
* Support adding free-form HTML attributes to select options; pass options as an object list, and add an `attr` sub-object
* Despecify select2 css rules in modal.scss (please do not use modal.scss, it's only for the demo page!)
* Restore, but deprecate custom `filled` event
* Deprecate single-item-object invocation of generateElements (note the plural)
