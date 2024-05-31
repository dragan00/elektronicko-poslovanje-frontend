import translations from "./assets/translations"
import store from "./redux/store"

const Translate =  ({textKey}) =>{

    const appLang = store.getState().User.appLang;

    let t = translations[appLang][textKey] || textKey;
    if(!t){
        t = "-no-transalte-"
    }

    return t;
}


export default Translate;