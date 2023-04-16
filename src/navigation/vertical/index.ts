import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Dashboard",
      path: "/dashboard",
      action: "read",
      subject: "dashboard",
      icon: "mdi:home-outline",
    },
    {
      title: "Patient",
      path: "/patient",
      action: "read",
      subject: "patient",
      icon: "mdi:patient-outline",
    },
    {
      title: "Upcoming Checkup",
      path: "/upcoming-checkup",
      action: "read",
      subject: "upcoming checkup",
      icon: "tabler:checkup-list",
    },
    {
      title: "Physician",
      path: "/physician",
      action: "read",
      subject: "physician",
      icon: "mdi:account-outline",
      children: [
        {
          title: "Today's Checkup",
          path: "/physician/todays-checkup",
          action: "read",
          subject: "today's checkup",
        },
        {
          title: "My Patient",
          path: "/physician/my-patient",
          action: "read",
          subject: "my patient",
        },
      ],
    },
    {
      title: "Appointment",
      path: "/appointment",
      action: "read",
      subject: "appointment",
      icon: "mdi:calendar-today-outline",
    },
  ];
};

export default navigation;
