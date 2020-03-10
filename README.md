# canvasom

> A canvas object model lib.

## Introduction

`canvasom` is a canvas object model lib that provides you with DOM-like APIs to manipulate canvas graphics. The goal of this lib is to make it easier to create UIs in canvas.

## Links

- [Documentation](https://github.com/huang2002/canvasom/wiki)
- [Contributing Guide](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)
- [License (MIT)](./LICENSE)

## Example

```js
const root = COM.create('root', {
    id: 'root',
    width: 480,
    height: 320,
}, [
    COM.create('text', {
        data: 'Hello, world!',
        x: 240,
        y: 160,
        style: {
            font: 'bold 30px Consolas',
            textAlign: 'center',
            textBaseline: 'middle',
        }
    })
]);

document.body.appendChild(root.canvas);
```
