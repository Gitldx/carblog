/**
 * 0:游客，1、车主，2:行人
 */
export type AccountRoleType = 0 | 1 | 2


export type LoginEventData = { accountHasLogined: boolean, onLaunch? : boolean ,stateStr? :string}