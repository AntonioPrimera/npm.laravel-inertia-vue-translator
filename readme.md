# Laravel Inertia Vue3 Translator

The `laravel-inertia-vue-translator` package was primarily built, to be paired with the
`antonioprimera/laravel-js-localization` package, to provide a seamless localization experience for
Laravel Inertia Vue3 apps.

The Laravel package provides the necessary backend functionality to expose the Laravel localization files to the
frontend, this package provides the necessary frontend functionality to access the localized strings in your Vue3
components.

While the two packages were built to work together, you can also use this package as a standalone package in your 
Inertia + Vue3 apps, without the Laravel package, by using the exposed `Translator` class directly and providing the
dictionary of translations manually (either from a JS Object or from an API).

## Installation

You can install the package via npm:

```bash
npm install laravel-inertia-vue-translator
```

If you are using the `antonioprimera/laravel-js-localization` package, this step is included in the
`php artisan js-localization:install` command, so you don't need to install it manually.

## Usage

### Setting up the vue plugin

When creating your Vue3 app, you should import the plugin directly from the package and use it in your app:

```js
import { createApp } from 'vue'
import {translatorPlugin} from 'laravel-inertia-vue-translator'

// Add the plugin to your Vue3 app
return createApp({ render: () => h(App, props) })
    //add the plugin to your Vue3 app
    .use(translatorPlugin)
    .mount('#app')
```

### Using the `txt` and `txts` helper functions

In order to use `txt` and `txts` helper functions in your Vue3 script sections, you can easily inject them into your
components, by using the `useTranslator` function, which basically injects the functions into your component's context.

```vue
//in any of your Vue3 components
<script setup>
    import {useTranslator} from "laravel-inertia-vue-translator";
    const {txt, txts} = useTranslator();

    //now you can use the txt and txts functions in your component
    const greeting = txt('Hello, :name', {name: 'John'});
    const apples = txts('apples', 5, {name: 'John'});
</script>
```

### Using a custom dictionary

If you are not using the `antonioprimera/laravel-js-localization` package, you can provide the dictionary
of translations manually, by injecting it into the options of the `translatorPlugin`. If the dictionary is already
available as a JS object, you can simply pass it to the plugin. If you are fetching the translations from an API, or
if the dictionary is not available at the time of the plugin registration, you can pass a function, which returns the
dictionary, to the plugin. This function will be called lazily, when the translations are needed.

```js
import { createApp } from 'vue'
import {translatorPlugin} from 'laravel-inertia-vue-translator'

//fetch the translations from an API
const dictionary = async () => {
    const response = await fetch('/api/translations');
    return await response.json();
}

// Add the plugin to your Vue3 app
return createApp({ render: () => h(App, props) })
    //add the plugin to your Vue3 app
    .use(translatorPlugin, {dictionary})
    .mount('#app')
```

You can get creative with the way you provide the translations, as long as the dictionary can be resolved to an object
with the translations.

### Using composite keys

Sometimes you want to provide the pluralization count and/or the replacement parameters as a single string, which
can be passed to the `txt` / `translate` function, without the need to provide the count and/or the replacement
parameters separately to the `txts` / `translatePlural` function.

For this, you can use the following syntax:

```js
import {Translator} from 'laravel-inertia-vue-translator';
const dictionary = {
    'fruits' : {
        'apples': '{0}I have no apples|{1}I have one apple|[2-*]I have :count apples and I have them from :name',
        'pears': 'Pear|Pears'
    }
}
const translator = new Translator(dictionary);
const apples = translator.translate('fruits.apples[5]{name:John}'); //I have 5 apples and I have them from John
const pear = translator.translate('fruits.pears[1]'); //Pear
const pears = translator.translate('fruits.pears[2]'); //Pears
const noPears = translator.translate('fruits.pears[0]'); //Pears
```

## Related packages

- [Composer Package: antonioprimera/laravel-js-localization](https://packagist.org/packages/antonioprimera/laravel-js-localization)