//--- This plugin will be used in the vue3 plugin sister package ------------------------------------------------------

//import Translator from "./Translator";
//import injectionKey from "./translatorInjectionKey";
//
//export default {
//    install(app, options) {
//        //the options should ideally contain the dictionary, but it can be set any time (even from an API call)
//        const translator = new Translator(options?.dictionary);
//
//        //add the translator methods to the app
//        app.config.globalProperties.translator = translator;          	//expose the entire translator object
//        app.config.globalProperties.txt = translator.translate;        	//expose the simple translation method (as a shortcut)
//        app.config.globalProperties.txts = translator.translatePlural; 	//expose the plural translation method (as a shortcut)
//
//        //provide the translator to the app (so it can be injected in the components)
//        app.provide(injectionKey, {
//            translator,
//            txt: translator.translate,
//            txts: translator.translatePlural,
//        });
//    }
//}
