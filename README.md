# Installation
```
npm install gimkit-flooder.js
```

# Example

```js
const Gimkit = require('gimkit-flooder.js');

const gimkit = new Gimkit();

gimkit.setPin(890045);

gimkit.on('joined', player => {
    console.log(`${player} joined`);
});

gimkit.on('error', error => {
    console.log(error);
});

gimkit.join('Sean V');
```
