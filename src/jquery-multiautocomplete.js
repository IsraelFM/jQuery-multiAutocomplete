/**
 * jQuery-multiAutocomplete
 * @version: v1.2.0
 * @author: Israel Moraes
 * 
 * Created by Israel Moraes on 2020-07-13. Please report any bug at https://github.com/IsraelFM/jQuery-multiAutocomplete
 *
 * Developed with UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
 * https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
 */

(function (factory) {

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object' && typeof require === 'function') {
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}

} (function ($) {
    'use strict';

    const MultiAutocomplete = function (el, suggestions, options) {
        let prototype = {
            events: function () {
                el
                .on('keydown.multiAutocomplete', function (event) {
                    const suggestionClass = jPlugin.class.suggestion, selectedClass = jPlugin.class.selected;

                    if(event.keyCode === keys.SPACE) {
                        if (event.metaKey || event.ctrlKey) {
                            prototype.createSuggestionContainers();
                        } else {
                            suggestionsContainer.hide();
                        }
                    }

                    // TODO: REESCREVER AS FUNÇÕES ABAIXO. MELHORAR A LEGIBILIDADE
                    if (event.keyCode === keys.PAGEDOWN) {
                        const selectorSelected = suggestionsContainer.find(`.${selectedClass}`);

                        if (selectorSelected.length) {
                            selectorSelected.removeClass(selectedClass);
                            jPlugin.selectedIndex = selectorSelected.data('index')+jPlugin.options.maxShowSuggestion;

                            if(jPlugin.selectedIndex > suggestionsContainer.children().length) {
                                jPlugin.selectedIndex = suggestionsContainer.children().last().data('index');
                            }
                            suggestionsContainer.children().eq(jPlugin.selectedIndex).addClass(selectedClass).get(0).scrollIntoView({block: 'start'});
                        }
                    }

                    if (event.keyCode === keys.PAGEUP) {
                        const selectorSelected = suggestionsContainer.find(`.${selectedClass}`);

                        if (selectorSelected.length) {
                            selectorSelected.removeClass(selectedClass);
                            jPlugin.selectedIndex = selectorSelected.data('index')-jPlugin.options.maxShowSuggestion;

                            if(jPlugin.selectedIndex < 0) {
                                jPlugin.selectedIndex = suggestionsContainer.children().first().data('index');
                            }
                            suggestionsContainer.children().eq(jPlugin.selectedIndex).addClass(selectedClass).get(0).scrollIntoView({block: 'end'});
                        }
                    }

                    if (event.keyCode === keys.DOWN) {
                        const selectorSelected = suggestionsContainer.find(`.${selectedClass}`);

                        if (selectorSelected.next(`.${suggestionClass}`).length) {
                            selectorSelected.removeClass(selectedClass).next().addClass(selectedClass);
                            jPlugin.selectedIndex = selectorSelected.data('index');
                            selectorSelected.next(`.${suggestionClass}`).get(0).scrollIntoView({block: 'nearest'});
                        }
                    }

                    if (event.keyCode === keys.UP) {
                        const selectorSelected = suggestionsContainer.find(`.${selectedClass}`);

                        if (selectorSelected.prev(`.${suggestionClass}`).length) {
                            selectorSelected.removeClass(selectedClass).prev().addClass(selectedClass);
                            jPlugin.selectedIndex = selectorSelected.data('index');
                            selectorSelected.prev(`.${suggestionClass}`).get(0).scrollIntoView({block: 'nearest'});
                        }
                    }

                    if ($.inArray(event.keyCode, jPlugin.options.stopSuggestionKeys) !== -1) {
                        if (suggestionsContainer.children().length > 0) {
                            let selectedSuggestion = suggestionsContainer.find(`.${suggestionClass}.${selectedClass}`).html();
                            prototype.updateSelection(prototype.getCompletion(selectedSuggestion));
                        }

                        el.blur()
                        el.focus();
                        return false;
                    }
                })
                .on('keyup.multiAutocomplete', function (event) {
                    const hasSpecialKeys = event.altKey || event.metaKey || event.ctrlKey;

                    switch (event.keyCode) {
                        case keys.UP:
                        case keys.DOWN:
                        case keys.PAGEDOWN:
                        case keys.PAGEUP:
                            break;    
                        case keys.LEFT:
                        case keys.RIGHT:
                        case keys.TAB:
                        case keys.BACKSPACE:
                        case keys.DEL:
                            if (suggestionsContainer.is(':visible') || jPlugin.options.autosuggest) {
                                prototype.createSuggestionContainers();
                            }
                            break;
                        case keys.ESC:
                            suggestionsContainer.hide();
                            break;
                        default:
                            if (suggestionsContainer.is(':visible') || (!hasSpecialKeys && jPlugin.options.autosuggest)) {
                                let chunk = prototype.getChunk();

                                if (chunk.length >= jPlugin.options.minChunkSize) {
                                    prototype.createSuggestionContainers();
                                }
                            }
                            break;
                    }
                })
                .on('blur.multiAutocomplete', function () {
                    suggestionsContainer.hide();
                });
                suggestionsContainer
                .on('mouseout.multiAutocomplete', function () {
                    $('.'+jPlugin.class.suggestion).removeClass(jPlugin.class.hover);
                })
                .on('mouseover.multiAutocomplete', '.'+jPlugin.class.suggestion, function () {
                    $(this).addClass(jPlugin.class.hover);
                })
                .on('mousedown.multiAutocomplete', '.'+jPlugin.class.suggestion, function (event) {
                    let selectedSuggestion = $(this).html();
                    prototype.updateSelection(prototype.getCompletion(selectedSuggestion));
                    prototype.createSuggestionContainers();
                    el.focus();
                    event.preventDefault();
                })
            },
            destroyEvents: function () {
                el.off(['keydown', 'keyup', 'blur', 'mouseout', 'mouseover', 'mousedown', ''].join('.multiAutocomplete '));
            },
            getChunk: function () {
                let delimiters = jPlugin.options.delimiters.split(''),
                    textBeforeCursor = el.val().substr(0, prototype.getInputSelection(el).start),
                    indexOfDelimiter = -1,
                    delimiter,
                    idx;

                for (let index = 0; index < delimiters.length; index++) {
                    delimiter = delimiters[index];
                    idx = textBeforeCursor.lastIndexOf(delimiter);
    
                    if (idx > indexOfDelimiter) {
                        indexOfDelimiter = idx;
                    }
                }
    
                if (indexOfDelimiter < 0) {
                    return textBeforeCursor;
                } else {
                    return textBeforeCursor.substr(indexOfDelimiter + 1);
                }
            },
            updateSelection: function (completion) {
                let selection = prototype.getInputSelection(el),
                    selectionStart = selection.start,
                    selectionEnd = selectionStart + completion.length;

                if (selection.elDOM.setRangeText) {
                    selection.elDOM.setRangeText(completion);
                } else { // Workaround to suport Edge
                    let before = el.val().substring(0, selectionStart),
                        after = el.val().substring(selectionEnd, el.val().length),
                        between = el.val().substring(selectionStart, selectionEnd);
                    el.val(before+completion+between+after);
                }
               
                selection.elDOM.setSelectionRange(selectionEnd, selectionEnd);
            },
            createSuggestionContainers: function () {
                let textBeforeCursor = prototype.getChunk(),
                    suggestion,
                    html = '',
                    idx = 0;

                // Suggest only match the prefix
                if (jPlugin.options.prefixRegexps.test(textBeforeCursor)) {
                    // Search the variant
                    for (let index = 0; index < suggestions.length; index++) {
                        suggestion = suggestions[index];

                        if (jPlugin.options.ignoreCase) {
                            suggestion = suggestion.toLowerCase();
                            textBeforeCursor = textBeforeCursor.toLowerCase();
                        }
                        
                        // Some variant is found
                        if (suggestion.indexOf(textBeforeCursor) === 0) {
                            let classes = `${jPlugin.class.suggestion} ${(idx === 0) ? jPlugin.class.selected : ''}`,
                                suggestionDetach = `<strong>${textBeforeCursor}</strong>${suggestion.substr(textBeforeCursor.length)}`;
                            html += `<div class="${classes}" data-index="${idx++}">${suggestionDetach}</div>`;
                        }
                    }
                }
                
                suggestionsContainer.html(html);
                (html) ? suggestionsContainer.show() : suggestionsContainer.hide();
                jPlugin.selectedIndex = 0;

                const suggestionElements = suggestionsContainer.find(`.${jPlugin.class.suggestion}`);
                if (suggestionElements.length) {
                    suggestionElements.get(0).scrollIntoView({block: 'nearest'});
                }
            },
            getCompletion: function (selectedSuggestion) {
                let textBeforeCursor = prototype.getChunk(),
                    chunkDetached = selectedSuggestion.replace(/<[^>]*>(.*?)[^>]*>/, ''),
                    suggestion = textBeforeCursor + chunkDetached;

                return suggestion.substr(textBeforeCursor.length) + jPlugin.options.endingSymbols;
            },
            getInputSelection: function (el) {
                el = el.get(0);
                let start = 0,
                    end = 0;

                if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
                    start = el.selectionStart;
                    end = el.selectionEnd;
                }

                return {
                    elDOM: el,
                    start: start,
                    end: end
                };
            }
        };

        el = $(el); // reference to the jQuery version of DOM element
        let jPlugin = this,
            suggestionsContainer;

        // public methods
        jPlugin.suggestions = suggestions;
        jPlugin.options = options;

        jPlugin.destroy = function (element) {
            prototype.destroyEvents();
            element.removeData('multiAutocomplete');
        }

        jPlugin.init = function (isInput) {
            if (isInput) {
                jPlugin.options = $.extend({}, $.jPluginDefaults, options);
                jPlugin.selectedIndex = -1;
                jPlugin.class = {
                    suggestions: 'multiAutocomplete-suggestions',
                    suggestion: 'multiAutocomplete-suggestion',
                    selected: 'multiAutocomplete-selected',
                    hover: 'multiAutocomplete-hover'
                };

                el.attr('autocomplete', 'off');
                // Creating container of suggestions
                let suggestionsElement = utils.createContainer(jPlugin.class.suggestions, jPlugin.options.maxShowSuggestion); // reference to the actual DOM element
                suggestionsContainer = el.after(suggestionsElement).next();

                prototype.destroyEvents();
                prototype.events();
            }
        }

        jPlugin.init(el.is('input'));
    };
    
    // Accepted keys to stop suggestions
    const keys = {
        ALT: 18,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DEL: 46,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        COMMA: 188,
        PAGEUP: 33,
        PAGEDOWN: 34,
        BACKSPACE: 8,
        SPACE: 32,
    },
    utils = (function () {
        return {
            createContainer: function (containerClass, maxShowSuggestion) {
                const SIZE_EACH_SUGGESTION = 19.1;
                let maxHeight = maxShowSuggestion*SIZE_EACH_SUGGESTION;
                let div = document.createElement('div');
                div.className = containerClass;
                div.style['position'] = 'absolute';
                div.style['display'] = 'none';
                div.style['max-height'] = maxHeight+'px';
                div.style['overflow-y'] = 'auto';
                return div;
            }
        }
    })();

	/**
     * Entrypoint
     * @public
     * @param {String|Array} param an array with all suggestions or a method
     * @param {Object} options Options about the working of the plugin
     */
	$.fn.multiAutocomplete = function (param, options) {
        options = options || {};
        defaults = $.jPluginDefaults;

        let multiAutocompleteFunction = function () {
            let instance = $(this).data('multiAutocomplete');
            if (typeof param === 'string') {
                if (instance && typeof instance[param] === 'function') {
                    instance[param]($(this));
                }
            } else {
                if (instance) instance.destroy();
                return $(this).data('multiAutocomplete', new MultiAutocomplete(this, param, options));
            }
        };

        $(this).each(multiAutocompleteFunction);

        return this;
    }

    // Default options values
	let defaults = {
		delimiters: ' ',
        minChunkSize: 1,
        autosuggest: true,
        endingSymbols: '',
        prefixRegexps: /.*/,
        stopSuggestionKeys: [9, 13],
        ignoreCase: false,
        maxShowSuggestion: 10
    };

    $.jPluginDefaults = $.jPluginDefaults || {};
    defaults = $.jPluginDefaults = $.extend(true, {}, defaults, $.jPluginDefaults);

}));
