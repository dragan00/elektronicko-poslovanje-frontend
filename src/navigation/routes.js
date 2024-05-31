// Icons
import home from '../assets/icons/home.png'
import home_active from "../assets/icons/home_active.png";
import routes from "../assets/icons/routes.png";
import routes_active from "../assets/icons/routes_active.png";
import company from "../assets/icons/company.png";
import company_active from "../assets/icons/company_active.png";
import about from "../assets/icons/services.png";
import about_active from "../assets/icons/services_active.png";
import new_icon from "../assets/icons/new.png"; // new  => reserved word
import new_active_icon from "../assets/icons/new_active.png";
import Translate from '../Translate';

// Tabs
const TABS = [
  { 
    pathname: 'cargo', 
    name: <Translate  textKey={"cargo"} /> 
  },
  { 
    pathname: 'loadingSpace', 
    name: <Translate  textKey={"loading_space"} />
  },
  { 
    pathname: 'warehouses', 
    name: <Translate  textKey={"warehouses"} /> 
  },
]

// Array of routes
export const ROUTES = [
  {
    pathname: "/home",
    title: <Translate textKey={"home_page"} />,
    active_icon: home_active,
    icon: home,
  },
  {
    pathname: "/routes",
    title: <Translate textKey={"ad_search"} />,
    active_icon: routes_active,
    icon: routes,
    sub_routes: TABS
  },
  {
    pathname: "/new",
    title: <Translate textKey={"nk_create_add"} />,
    active_icon: new_active_icon,
    icon: new_icon,
    sub_routes: TABS
  },
  {
    pathname: "/companies",
    title: <Translate textKey={"company_search"} />,
    active_icon: company_active,
    icon: company,
  },
  {
    pathname: "/about",
    title: <Translate textKey="information"  />,
    active_icon: about_active,
    icon: about,
  },
];

export const ROUTE_NAMES = [
  {
    pathname: "",
    title: "",
    hideBackButton: false
  },
  {
    pathname: "/home",
    title: <Translate textKey={"home_page"} />,
    hideBackButton: true
  },
  {
    pathname: "/routes/cargo",
    title: "Pretraga tereta",
    hideBackButton: true
  },
  {
    pathname: "/routes/loadingSpace",
    title: "Pretraga utovarnog prostora",
    hideBackButton: true
  },
  {
    pathname: "/routes/warehouses",
    title: <Translate textKey={"warehouse_search"} />,
    hideBackButton: true
  },
  {
    pathname: "/new/cargo",
    title: "Moji tereti",
    hideBackButton: true
  },
  {
    pathname: "/new/loadingSpace",
    title: "Moji utovarni prostori",
    hideBackButton: true
  },
  {
    pathname: "/new/warehouses",
    title: <Translate textKey={"my_warehouses"} />,
    hideBackButton: true
  },
  {
    pathname: "/companies",
    title: "Poduzeća",
    hideBackButton: false
  },
  {
    pathname: "/profile/about",
    title: "Profil poduzeća",
    hideBackButton: false
  },
  {
    pathname: "/about",
    title: <Translate textKey={"information"} />,
    hideBackButton: false
  }, 
];

export const ROUTES_WITHOUT_BACK_BUTTON = [
  {
    pathname: "",
    title: "",
  },
  {
    pathname: "/home",
    title: <Translate textKey={"home_page"} />,
  },
  {
    pathname: "/routes/cargo",
    title: <Translate  textKey={"ad_search"} />,
  },
  {
    pathname: "/routes/loadingSpace",
    title: "Objavljeni utovarni prostori",
  },
  {
    pathname: "/routes/warehouses",
    title: "Objavljena skladišta",
  },
  {
    pathname: "/new/cargo",
    title: "Dodadavanje tereta",
  },
  {
    pathname: "/new/loadingSpace",
    title: "Dodadavanje utovarnog prostora",
  },
  {
    pathname: "/new/warehouses",
    title: "Dodadavanje skladišta",
  },
  {
    pathname: "/companies",
    title: <Translate textKey={"company_search"}  />,
  },
  {
    pathname: "/about",
    title:  <Translate textKey={"information"} />,
  },
 
];
