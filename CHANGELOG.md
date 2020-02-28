# 0.2.0
* Drop requirements for assorted IE <= 9 shim scripts only included on demo page
* Remove digitizing toolset code, this is now moved to the Mapbender Digitizer repository

# 0.1.80
* Error for unsupported values for `.mandatory` is now thrown immediately on rendering, instead of later during form data extraction
* No longer generate invalid `<input type="input" ...`, use proper type `"text"` instead
* Suppress resultTable column button text unless explicitly passed in `.text` property (obviates the need for CSS hacks)
* Respect `maximizable` option also for double-click handling on popup title
* Fix inconsistent `.infoText` on checkboxes
* Fix Fontawesome 5 conflicts in `.infoText` markup

# 0.1.79
* Fix date type input cross-browser behaviour
* Preinitialize required (`mandatory`) date inputs to current date

# 0.1.78
* Add `vis-ui` CSS class to all top-level generated items to allow more specifically guided CSS rules
* Support passing 'declarations' object to override generateElements individual tag-generating functions
* Support passing already constructed dom nodes as child elements, these will be appended without modification
* Support adding free-form HTML attributes to select options; pass options as an object list, and add an `attr` sub-object
* Support adding free-form HTML attributes (via `attr` sub-object on passed item) on:
  * `html`
  * `form`
  * `container`
  * `fluidContainer`
    * Also support extra `rowAttr` sub-object; `attr` goes on the outer container, `rowAttr` on the embedded `div.row`
  * `inline`
  * `button`
  * `submit`
  * `breakLine`
  * `text`
  * `resultTable`
  * `digitizingToolSet` (already deprecated, removed in 0.2.0)
* Despecify select2 css rules in modal.scss (please do not use modal.scss, it's only for the demo page!)
* Restore, but deprecate custom `filled` event
* Deprecate single-item-object invocation of generateElements (note the plural)
* [fringe Break] remove demo-only Leaflet map. This is incoherent with our desired use cases.  
  Putting a Leaflet map on top of an OpenLayers-based Mapbender Application is asking for trouble. If you want a
  Leaflet map, follow [the tutorial](https://leafletjs.com/examples/quick-start/).