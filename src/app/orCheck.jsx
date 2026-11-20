import { Check } from "./Check";

/** the value if it's filled in, otherwise the yellow "ПРОВЕРЬ ЗДЕСЬ" marker */
export const orCheck = (value, hint) => (value ? value : <Check hint={hint} />);
