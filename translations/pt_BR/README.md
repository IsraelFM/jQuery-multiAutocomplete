# jQuery-multiAutocomplete

> Um plugin jQuery que permite múltiplos autocompletes em um campo de texto.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://github.com/IsraelFM/jQuery-multiAutocomplete/blob/master/README.md) [![GitHub last commit](https://img.shields.io/github/last-commit/IsraelFM/jquery-multiAutocomplete)]() [![GitHub tag](https://img.shields.io/github/tag/IsraelFM/jquery-multiAutocomplete)]() [![GitHub created](https://img.shields.io/badge/created-july%202020-important)]() [![GitHub size js](https://img.shields.io/badge/minified_javascript-5kb-informational)]() [![GitHub size css](https://img.shields.io/badge/minified_css-981b-informational)]()

*Leia em outros idiomas: [English](README.md).*  

## Demonstração

![](/example/multiAutocomplete.gif)

## Compatibilidade

O jQuery-multiAutocomplete foi testado com o jQuery 1.7+ nos principais navegadores:

- Chrome 45+
- Firefox 22.7+
- Safari 10+
- Edge 12+
- Opera 28+
- IE (não suportado)

## Opções suportadas

| Opção | Padrão | Descrição |
| :--- | :--- | :--- |
| `delimiters` | ' ' (um espaço) | Essa opção aceita caracteres em formato de string. Esses caracteres definirão o começo de uma nova sugestão. Devem ser descritos um em sequência ao outro. Ex.: '\n '. |
| `minChunkSize` | `1` | Quantidade de caracteres mínimos digitados, para que as sugestões sejam exibidas. Essa opção não surte efeito caso o `prefixRegexps` não estiver com o valor descrito na coluna Padrão. |
| `autosuggest` | `true` | Possibilita atualização de sugestões em tempo real. Se for setado `false`, será necessária a utilização de <kbd>Ctrl</kbd>+<kbd>Space</kbd> ou <kbd>⌘ Command</kbd>+<kbd>Space</kbd> para exibir as sugestões. |
| `endingSymbols` | '' (string vazia) | Essa opção aceita um conjunto de caracteres (string), que irão ser concatenados a uma sugestão, após a seleção dela. Ex.: ', ' |
| `prefixRegexps` | `/.*/` | Essa opção aceita apenas expressões regulares. Ela especifica o prefixo obrigatório a ser digitado, para que as sugestões comecem a aparecer. |
| `stopSuggestionKeys` | `[9, 13]` | Essa opção aceita apenas um array de elementos. Teclas que serão pressionadas para confirmar a escolha de uma sugestão. Por padrão, são <kbd>Tab</kbd> ou <kbd>Enter</kbd>. |
| `ignoreCase` | `false` | Case sensitive ativado por padrão. Caso queira tornar case insensitive, basta setar para `true`. |

## Métodos Suportados

O jQuery-multiAutocomplete tem somente dois métodos:

- `init(suggests, options)`: inicializa a instância multiAutocomplete. Se já foi inicializado anteriormente para o mesmo objeto jQuery, a instância terá seus eventos desvinculados e vinculados novamente. O parâmetro `suggests` é um array de strings e as `options` estão descritas [acima](## Métodos Suportados).
- `destroy`: todos os eventos são desvinculados do objeto jQuery.

Esses métodos podem ser invocados de duas maneiras. Uma delas é passar uma string com o nome do método, assim que você chamar a instância multiAutocomplete.
A outra opção é chamar a instância sem um parâmetro e depois chamar o método.

```javascript
$('#suggests').multiAutocomplete(['foo', ..., 'bar'], options);
$('#suggests').multiAutocomplete('destroy');
// Ou
$('.suggests').multiAutocomplete().init(['foo', ..., 'bar']);
$('#suggests').multiAutocomplete().destroy();
```

## Exemplos

HTML:

```html
<input class='form-control' id='suggests' type='text'>
```

JavaScript:

```javascript
let suggests = ['foo', 'foo.bar', 'foo.bar[0]', 'bar', 'bar.foo'];

// Uso básico, somente passando um array com as sugestões
$('#suggests').multiAutocomplete(suggests);

// É necessário pressionar Ctrl+Space ou Command+Space para visualizar as sugestões
$('#suggests').multiAutocomplete(suggests, {
    autosuggest: false
});
```

## Suporte

Apenas abra uma Issue e eu vou ao seu encontro.
https://github.com/IsraelFM/jQuery-multiAutocomplete/issues
