// Deploy type => PRODUCTION | DEV | DRAGAN
export const deploy = process.env.REACT_APP_DEPLOY;

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Api endpoint
export const getApiEndpoint = () => {
  // DEV
  if (deploy === "DEV") {
    return "http://192.168.88.252:8008/api/";
  }

  // HET
  else if (deploy === "HET") {
    return "https://api.joker-transport.com/api/";
  }

  // LOCAL
  else if (deploy === "LOCAL") {
    return "http://192.168.88.203:8000/api/";
  }

  // PRODUCTION
  else if (deploy === "PRODUCTION") {
    return "https://http://fakultet.api.elektronickoposlovanje.neuros.hr/api/";
  }

  // DRAGAN
  else if (deploy === "DRAGAN") {
    return "https://192.168.88.203:8000/api/";
  }
};

export const getFilesRoute = () => {
  // DEV
  if (deploy === "DEV") {
    return "http://192.168.88.252:8008/mediafiles/";
  }

  // HET
  else if (deploy === "HET") {
    return "https://api.joker-transport.com/mediafiles/";
  }

  // LOCAL
  else if (deploy === "LOCAL") {
    return "http://localhost:8008/mediafiles/";
  }

  // PRODUCTION
  else if (deploy === "PRODUCTION") {
    return "";
  }

  // DRAGAN
  else if (deploy === "DRAGAN") {
    return "http://192.168.88.47:8008/mediafiles/";
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
