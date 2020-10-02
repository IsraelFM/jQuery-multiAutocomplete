# jQuery-multiAutocomplete

> A jQuery plugin that allows multiple autocompletes in a input.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/IsraelFM/jQuery-multiAutocomplete/blob/master/README.md) [![GitHub last commit](https://img.shields.io/github/last-commit/IsraelFM/jquery-multiAutocomplete)]() [![GitHub tag](https://img.shields.io/github/tag/IsraelFM/jquery-multiAutocomplete)]() [![GitHub created](https://img.shields.io/badge/created-july%202020-important)]() [![GitHub size js](https://img.shields.io/badge/minified_javascript-5kb-informational)]() [![GitHub size css](https://img.shields.io/badge/minified_css-~1kb-informational)]()

*Read this in other languages: [Portuguese](translations/pt_BR/README.md).*  

## Demonstration

![](/example/multiAutocomplete.gif)

## Compatibility

jQuery-multiAutocomplete has been tested with jQuery 1.7+ on major browsers:

- Chrome 45+
- Firefox 22.7+
- Safari 10+
- Edge 12+
- Opera 28+
- IE (not suported)

## CDN

### jsDelivr

- JavaScript: https://cdn.jsdelivr.net/gh/IsraelFM/jquery-multiautocomplete/dist/jquery-multiautocomplete.min.js
- CSS: https://cdn.jsdelivr.net/gh/IsraelFM/jquery-multiautocomplete/dist/jquery-multiautocomplete.min.css

## Supported options

| Option | Default | Description |
| :--- | :--- | :--- |
| `delimiters` | ' ' (a whitespace) | This option accepts characters in string format. These characters will define the beginning of a new suggestion. Must be described in sequence to each other (e.g. '\n '). |
| `minChunkSize` | `1` | Number of minimum characters typed, so that suggestions are displayed. This option has no effect if the `prefixRegexps` is not with the value described in the Default column |
| `autosuggest` | `true` | It allows updating suggestions in real time. If `false` is set, it will be necessary to use <kbd>Ctrl</kbd>+<kbd>Space</kbd> or <kbd>⌘ Command</kbd>+<kbd>Space</kbd> to display the suggestions. |
| `endingSymbols` | '' (a empty string) | This option accepts a set of characters (string), which will be concatenated to a suggestion, after selecting it (e.g. ', '). |
| `prefixRegexps` | `/.*/` | This option accepts only regular expressions. It specifies the mandatory prefix to be entered, so that suggestions start to appear. |
| `stopSuggestionKeys` | `[9, 13]` | This option accepts only one array of elements. Keys that will be pressed to confirm the choice of a suggestion. By default, the keys are <kbd>Tab</kbd> or <kbd>Enter</kbd>. |
| `ignoreCase` | `false` | Case sensitive enabled by default. If you want to make case insensitive, just set it to `true`. |
| `maxShowSuggestion` | `10` | Maximum number of suggestions visible at a time in the list of suggestions. |

## Supported methods

jQuery-multiAutocomplete has a only two methods:

- `init(suggests, options)`: initializes the multiAutocomplete instance. If it has already been initialized before for the same jQuery object, the instance will have its events unbind and bind again. The `suggests` parameter are one array of strings and `options` are described [above](#supported-options).
- `destroy`: all events are unbind of the jQuery object.

Theses methods can be invoked in two ways. One of them is to pass a string with the method name, as soon as you call the multiAutocomplete instance.
The other option is to call the instance without a parameter and then invoke the method.

```javascript
$('#suggests').multiAutocomplete(['foo', ..., 'bar'], options);
$('#suggests').multiAutocomplete('destroy');
// Or
$('.suggests').multiAutocomplete().init(['foo', ..., 'bar']);
$('#suggests').multiAutocomplete().destroy();
```

## Examples

HTML:

```html
<input class='form-control' id='suggests' type='text'>
```

JavaScript:

```javascript
let suggests = ['foo', 'foo.bar', 'foo.bar[0]', 'bar', 'bar.foo'];

// Basic Usage, only passing array of suggestions
$('#suggests').multiAutocomplete(suggests);

$('#suggests').multiAutocomplete(suggests, {
    // Only after typing "foo" or "bar", suggestions appeared
    prefixRegexps: /(foo|bar)/,
    // Are necessary press Ctrl+Space or Command+Space to see the suggestions
    autosuggest: false
});
```

## Support

Just open an Issue and I will meet you.
https://github.com/IsraelFM/jQuery-multiAutocomplete/issues
