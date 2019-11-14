import { themes, ThemeKey } from "../themes";

export class Config {

    static get currentTheme() : ThemeKey {
        return Config._themeKey
    }

    static _themeKey: ThemeKey
    static set currentTheme(themeKey: ThemeKey) {
        Config._themeKey = themeKey;
    }


    static currentThemeStyles(){
        return themes[Config._themeKey]
    }

}