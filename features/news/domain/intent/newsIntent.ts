export type NewsIntent =
    | { type: "FETCH_NEWS_LIST"; page: number }
    | { type: "CHANGE_PAGE"; page: number }
