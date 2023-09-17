import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      {
        icon: "Home",
        pathname: "/",
        title: "Dashboard",
      },
      {
        icon: "Sidebar",
        pathname: "/users",
        title: "Users",
      },
      {
        icon: "Trello",
        pathname: "/drafts",
        title: "Drafts",
      },
      {
        icon: "Trello",
        pathname: "/decided-cases",
        title: "Decided Cases",
      },
      {
        icon: "Trello",
        pathname: "/QandAs",
        title: "Q and As",
      },
      {
        icon: "FileText",
        pathname: "/statutes",
        title: "Statutes",
      },
      {
        icon: "Edit",
        pathname: "/past-questions",
        title: "Past Questions",
      },
      {
        icon: "Edit",
        pathname: "/BOW",
        title: "BOW",
      },
      {
        icon: "Edit",
        pathname: "/institutions",
        title: "Institutions",
      },
      {
        icon: "Edit",
        pathname: "/ads",
        title: "Ads",
      },
      {
        icon: "Edit",
        pathname: "/notifications",
        title: "Notification",
      },
    ],
  },
});

export { sideMenu };
