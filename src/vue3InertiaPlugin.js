import Translator from "./Translator";
import injectionKey from "./translatorInjectionKey";
import {usePage} from "@inertiajs/vue3";	//used to get the dictionary from the page props

export default {
	install(app, options) {
		const inertiaDictionary = () => {
			return options && options.dictionary ? options.dictionary : usePage().props.dictionary;
		};
		
		const translator = new Translator(inertiaDictionary);
		
		//define the translator methods, using the dictionary from the options or the page
		const translate = (key, replace) => translator.translate(key, replace);
		const translatePlural = (key, count, replace) => translator.translatePlural(key, count, replace);
		
		//add the translator methods to the app
		app.config.globalProperties.translator = translator;          	//expose the entire translator object
		app.config.globalProperties.txt = translate;        	//expose the simple translation method (as a shortcut)
		app.config.globalProperties.txts = translatePlural; 	//expose the plural translation method (as a shortcut)
		
		//provide the translator to the app (so it can be injected in the components)
		app.provide(injectionKey, {
			translator,
			txt: translate,
			txts: translatePlural,
		});
	}
}
