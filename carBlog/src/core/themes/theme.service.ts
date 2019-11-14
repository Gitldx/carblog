import { ThemeKey, themes } from '@src/core/themes';
import {getThemeValue} from 'react-native-ui-kitten/theme/theme/theme.service'
import { Config } from '../uitls/config';

export class ThemeService {

  public static select = <T>(config: { [key in ThemeKey | 'default']?: T },
                             currentTheme: ThemeKey): T | null => {

    if (config[currentTheme]) {
      return config[currentTheme];
    } else if (config.default) {
      return config.default;
    } else {
      return null;
    }
  };


  public static getPrimaryColor():string{
    return Config.currentTheme == "Eva Light" ? getThemeValue("color-primary-default",themes["Eva Light"]) : getThemeValue("color-primary-default",themes["Eva Dark"])
  }

}
