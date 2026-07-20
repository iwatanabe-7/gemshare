// DB の prompts_title_check 制約と一致させること。
// CHECK ((char_length(title) >= 2) AND (char_length(title) <= 100))
export const TITLE_MIN_LENGTH = 2;
export const TITLE_MAX_LENGTH = 100;
