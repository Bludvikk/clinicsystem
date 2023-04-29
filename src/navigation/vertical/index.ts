import { VerticalNavItemsType } from 'src/@core/layouts/types';

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:home-outline',
      action: 'read',
      subject: 'dashboard'
    },
    {
      title: 'Reference',
      path: '/apps/reference',
      icon: 'mdi:list-box-outline',
      action: 'read',
      subject: 'reference'
    },
    {
      title: 'User',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'user',
      children: [
        {
          title: 'List',
          path: '/apps/user/list',
          action: 'read',
          subject: 'user'
        }
      ]
    },
    {
      title: 'Patient',
      icon: 'mdi:patient-outline',
      action: 'read',
      subject: 'patient',
      children: [
        {
          title: 'List',
          path: '/apps/patient/list',
          action: 'read',
          subject: 'patient'
        }
      ]
    },
    {
      title: 'Checkup',
      icon: 'tabler:checkup-list',
      action: 'read',
      subject: 'checkup-vital-signs',
      children: [
        {
          title: 'List',
          path: '/apps/checkup/list',
          action: 'read',
          subject: 'checkup-vital-signs'
        }
      ]
    },
    {
      title: 'Physician',
      icon: 'mdi:account-outline',
      action: 'read',
      subject: 'physician',
      children: [
        {
          title: 'checkup',
          action: 'read',
          subject: 'checkup',
          children: [
            {
              title: 'List',
              path: '/apps/physician/checkup/list',
              action: 'read',
              subject: 'checkup'
            }
          ]
        }
      ]
    },
    {
      title: 'Appointment',
      path: '/appointment',
      action: 'read',
      subject: 'appointment',
      icon: 'mdi:calendar-today-outline'
    }
  ];
};

export default navigation;
