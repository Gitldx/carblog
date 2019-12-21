import { themes, ThemeKey } from "../themes";

export class Config {

    static get currentTheme() : ThemeKey {
        if(Config._themeKey != null){
            return Config._themeKey
        }
        else{
            return "Default"
        }
    }

    static _themeKey: ThemeKey
    static set currentTheme(themeKey: ThemeKey) {
        Config._themeKey = themeKey;
    }


    static currentThemeStyles(){
        return themes[Config._themeKey]
    }

}