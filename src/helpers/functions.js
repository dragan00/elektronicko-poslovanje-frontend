import moment from "moment";
import "moment/locale/hr";
import locale from "antd/es/date-picker/locale/hr_HR";
import Compressor from "compressorjs";

export const getTranslation = (arr, lang) => {
  if (typeof arr === "string") {
    return { name: arr };
  }

  if (!arr || !Array.isArray(arr)) {      
    return {};
  }

  let tran = arr?.find((x) => x.lang === lang);

  return tran;
};

export const setPrepareByLang = (data, lang) => {
  if (!data || !data.goods_types) {
    return {
      goods_types: [],
      vehicle_types: [],
      vehicle_upgrades: [],
      vehicle_equipment: [],
      contact_accounts: [],
    };
  }

  const prepare = {
    goods_types: [],
    vehicle_types: [],
    vehicle_upgrades: [],
    vehicle_equipment: [],
    contact_accounts: [],
  };
  let tmpArr = [];


  data.goods_types.forEach((element) => {
    tmpArr.push({
      id: element.id,
      ...element.name.find((x) => x.lang === lang),
    });
  });
  prepare.goods_types = tmpArr;
  tmpArr = [];

  data.vehicle_types.forEach((element) => {
    tmpArr.push({
      id: element.id,
      ...element.name.find((x) => x.lang === lang),
    });
  });
  prepare.vehicle_types = tmpArr;
  tmpArr = [];

  data.vehicle_upgrades.forEach((element) => {
    tmpArr.push({
      id: element.id,
      ...element.name.find((x) => x.lang === lang),
    });
  });
  prepare.vehicle_upgrades = tmpArr;
  tmpArr = [];

  data.vehicle_equipment.forEach((element) => {
    tmpArr.push({
      id: element.id,
      ...element.name.find((x) => x.lang === lang),
    });
  });
  prepare.vehicle_equipment = tmpArr;
  tmpArr = [];

  prepare.contact_accounts = data.contact_accounts;
  tmpArr = [];

  return prepare;
};

export const createQueryParamsFromFilter = (data, next_cursor = null) => {
  if (!Object.keys(data).length) {
    return { next_cursor };
  }

  const from = convertPlacesForBackend(data.from);
  const to = convertPlacesForBackend(data.to);

  return {
    vehicle_types: data.vehicle.type?.join("|"),
    vehicle_upgrades: data.vehicle.upgrades?.join("|"),
    vehicle_equipment: data.vehicle.equipment?.join("|"),
    min_length: data.vehicle.min_length,
    max_length: data.vehicle.max_length,
    min_weight: data.vehicle.min_weight,
    max_weight: data.vehicle.max_weight,
    next_cursor,
    countries_from: from.countries,
    cities_from: from.cities,
    zip_codes_from: from.zip_codes,
    countries_to: to.countries,
    cities_to: to.cities,
    zip_codes_to: to.zip_codes,
    show_blocked_users: data.show_blocked_users ? 1 : 0,
    auction: data.auction ? 1 : 0,
    date_from: data.date_from,
    date_to: data.date_to,
    status: "active|closed",
  };
};

const convertPlacesForBackend = (data) => {
  const convert = {
    countries: [],
    cities: [],
    zip_codes: [],
  };
  data.forEach((x) => {
    if (x.zip_code?.id) {
      convert.zip_codes.push(x.zip_code.id);
    } else if (x.city?.id) {
      convert.cities.push(x.city.id);
    } else {
      convert.countries.push(x.country?.id);
    }
  });

  convert.countries = convert.countries.join("|");
  convert.cities = convert.cities.join("|");
  convert.zip_codes = convert.zip_codes.join("|");

  return convert;
};

export const validateJoin = (str) => {
  if (str === "|") {
    return null;
  }

  return str;
};

export const isValidSecondGreater = (first, second) => +second > +first;

export const createLoadUnloadTime = (date, time) => {
  if (!date || !date.isValid()) {
    return null;
  }
  if (!time) {
    return date;
  }
  let _date = moment(date.format("YYYY-MM-DD"));

  return _date.add({ hours: time.hour(), minutes: time.minutes() });
};

export const sortByPostalCode = (data, key, type) => {
  let sort = [];

  let compare = (strA, strB, key, type) => {
    var zip_code_a = +strA[key].filter((x) => x.type === type)[0].zip_code
      ?.name;
    var zip_code_b = +strB[key].filter((x) => x.type === type)[0].zip_code
      ?.name;

    if (zip_code_a > zip_code_b) {
      return 1;
    } else if (zip_code_a < zip_code_b) {
      return -1;
    } else {
      // the characters are equal.
      return 0;
    }
  };

  sort = data.sort((a, b) => compare(a, b, key, type));

  return sort;
};

export const fitlerDataById = (arr, id, key) => {
  if (!id) {
    return arr;
  }
  return arr.filter((x) => x[key] === id);
};

export const getTimeDatePlaces = (start, end) => {
  const startDate = moment(start);
  const endDate = moment(end);

  return {
    from_date: moment(startDate.format("YYYY.MM.DD"), "YYYY-MM-DD"),
    from_time: moment(startDate.format("hh.mm"), "hh.mm"),

    to_date: moment(endDate.format("YYYY.MM.DD"), "YYYY-MM-DD"),
    to_time: moment(endDate.format("hh.mm"), "hh.mm"),
  };
};

export const createTabName = (from, to, all_ads) => {


  let startName = from.map((x) => x.country.alpha2Code).join(" ");
  let endName = to.map((x) => x.country.alpha2Code).join(" ");

  if (!startName.length) {
    startName = all_ads;
  }
  if (!endName.length) {
    endName =  all_ads;
  }

  return startName + "-" + endName;
};

export const mergeBySort = (exsitingData, newData) => {
  if (!newData || !newData.length) {
    return exsitingData;
  }
  newData.forEach((item) => {
    exsitingData.push(item);
  });

  return exsitingData;
};

export const selectOptions = (callback, itemName) => ({
  onFocus: () => callback(itemName),

  onBlur: () => callback(""),

  onSelect: () => callback(itemName),
});

export const DATETIME_PICKER_OPTIONS = (
  visibilityCallback,
  format,
  itemName
) => ({
  format,
  inputReadOnly: true,
  disabledDate: (current) => moment().add(-1, "days") >= current,
  style: { width: "100%" },
  locale,
  onBlur: () => {
    visibilityCallback("");
  },
  onFocus: () => {
    visibilityCallback(itemName);
  },
  onClick: () => {
    visibilityCallback(itemName);
  },
});

export function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

export const filterWarhouses = (arr, value) => {
  let tmpArr = arr ? [...arr] : [];
  if (value) {
    tmpArr = arr.filter((x) =>
      (x.stock_equipment + x.stock_types)
        .toLowerCase()
        .includes(value.toLowerCase())
    );
  }

  return tmpArr;
};

export const getDatesPeriod = (date, periodType) => {
  let date_from = null;
  let date_to = null;

  if (date) {
    date_from = moment(date).startOf(periodType);
    date_to = moment(date).endOf(periodType);
  }

  return { date_from, date_to };
};

export const compressImage = async (file, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      success: (result) => {
        resolve(new File([result], file.name, { type: result.type }));
      },
      error: (error) => reject(error),
    });
  });
};

export const mapCItiesFilter = (data, key) => {
  let arr = [];

  data.forEach((x) => {
    x[key].forEach((y) => {
      if(!isCitAlreadyIn(y.city.id, arr)){
        arr.push({ name: y.city.name, id: y.city.id, selected: false });
      }
    });
  });


  arr.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
})

  return arr;
};

const isCitAlreadyIn = (city_id, data) => {
  return data.filter(x => x.id === city_id).length > 0
}
