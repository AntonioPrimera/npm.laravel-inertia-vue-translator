import Translator from "./src/Translator";
import translatorPlugin from "./src/vue3InertiaPlugin";
import injectionKey from "./src/translatorInjectionKey";
import {inject} from "vue";

//export the translator instance (which was provided inside the plugin)
const useTranslator = () => inject(injectionKey);

export {
	Translator,			//the translator class (so it can be extended or instantiated)
	useTranslator,		//the injection method (to access the translator methods in the component scripts)
	translatorPlugin,		//the Inertia plugin (to add the translator methods to the app)
};