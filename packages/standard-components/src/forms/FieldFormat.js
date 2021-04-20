// Double quote and backslash must be escape by backspace

export const fieldFormat = {
  email: {
    name: "Mail address",
    type: "email",
    message: "The field must be email address",
    regexp: "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
  },
  alphaNumNoSpace: {
    name: "Alphanumeric without space",
    type: "alphaNumNoSpace",
    message: "Use only a-z, A-Z and 0..9 without space",
    regexp: "^[a-zA-Z0-9]*$",
  },
  alphaNumSpace: {
    name: "Alphanumeric with space",
    type: "alphaNumSpace",
    message: "Use only a-z, A-Z and 0..9 and space",
    regexp: "^[a-zA-Z0-9 ]*$",
  }, 
  lowerAlpha: {
    name: "Lowercase Alphabetic Characters",
    type: "lowerAlpha",
    message: "Use only Lowercase letters only",
    regexp: "^([a-z])*$",
  }, 
  upperAlpha: {
    name: "Uppercase Alphabetic Characters",
    type: "upperAlpha",
    message: "Use only Lowercase letters only",
    regexp: "^([A-Z])*$",
  },
  url: {
    name: "URL",
    type: "url",
    message: "The field must be an URL",
    regexp: "^(http:\\\/\\\/www\\.|https:\\\/\\\/www\\.|http:\\\/\\\/|https:\\\/\\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\\/.*)?$",
  },
  ip: {
    name: "IPv4 or IPv6 address",
    type: "ip",
    message: "The field must be an IPv4 or IPv6 address",
    regexp: "((^\\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\\s*$)|(^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$))",
  },
  custom: {
    name: "Custom format",
    type: "custom",
    message: "The field does not respect format",
    regexp: "",
  }
}