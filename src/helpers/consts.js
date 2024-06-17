export const INPUT_NUMBER_RULE = {
  pattern: new RegExp(/^[0-9]*\.?[0-9]*$/),
  message: "Samo decimalni brojevi sa točkom!",
};

export const INPUT_MAX_MIN_NUM_RULE = {
  min: 1,
  max: 5,
  message: "Broj znakova između 1-4",
};

export const CARGO_PLACE_TYPE = {
  LOAD: "load",
  UNLOAD: "unload",
};

 

export const PHONE_NUM_TYPE = {
  FAX: "fax",
  TEL: "tel",
};

export const LOAD_SPACE_PLACE_TYPE = {
  DESTINATION: "destination",
  START: "starting",
};

export const LANGS = [
  { label: "hr", value: "hr" },
  { label: "EN", value: "en" },
  { label: "DE", value: "de", disabled: true },
];

export const ADD_STATUSES = { ACTIVE: "active", CLOSED: "closed" };

export const collOptions = {
  xxl: 8,
  xl: 8,
  lg: 12,
  sm: 24,
  xs: 24,
};

export const COMPANY_STATUSES = {
  ACTIVE: { value: "active", text: "Aktivno" },
  NEED_CONFIRM: { value: "need_confirm", text: "Čeka potvrdu" },
  REJECTED: { value: "rejected", text: "Odbačen" },
};

export const IMAGE_TYPES = ["image/png", "image/jpeg"];

export const DATE_FORMAT = "DD-MM-YYYY"



