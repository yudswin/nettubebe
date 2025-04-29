// register-paths.js
const { register } = require('tsconfig-paths');
const { resolve } = require('path');

const baseUrl = resolve(__dirname, 'dist');

register({
    baseUrl,
    paths: {
        "@middleware/*": ["middleware/*"],
        "@configs/*": ["configs/*"],
        "@controllers/*": ["controllers/*"],
        "@db/*": ["db/*"],
        "@routes/*": ["routes/*"],
        "@services/*": ["services/*"],
        "@schema/sql/*": ["models/mysql/*"],
        "@schema/pg/*": ["models/pg/*"],
        "@types/*": ["types/*"],
        "@libs/*": ["libs/*"],
        "@data/*": ["data/*"]
    }
});
