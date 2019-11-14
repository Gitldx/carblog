import { NavigationScreenProps } from "react-navigation";

export interface NavigationRouteState {
    index: number;
    routes: any[];
    routeName?: string;
  
    params: { [key: string]: any };
  }


  export const getCurrentnavigationOptions = (props: NavigationScreenProps):any =>{
    const index: number = getCurrentRouteIndex(props.navigation);
    return (props as any).scenes[index].descriptor.options
  }

  
  export const getCurrentStateName = (state: NavigationRouteState): string => {
    return findCurrentRoute(state).routeName;
  };
  
  export const getCurrentRouteState = (navigation: any): NavigationRouteState => {
    return findCurrentRoute(navigation.state);
  };
  
  export const getCurrentRouteIndex = (navigation: any): number => {
    return navigation.state.index;
  };
  
  const findCurrentRoute = (state: NavigationRouteState): NavigationRouteState => {
    if (state.routes && state.routes.length !== 0) {
      return findCurrentRoute(state.routes[state.index]);
    }
  
    return state;
  };
  
  export const isRootRoute = (index: number): boolean => {
    return index !== 0;
  };
  