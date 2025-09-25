
import HomePage from '../pages/home.svelte';
import NotFoundPage from '../pages/404.svelte';
import LoginPage from '../pages/login.svelte';
import RegisterPage from '../pages/register.svelte';
import RequestForgetPassword from "../pages/forgot-password/request.svelte";
import ResetPassword from "../pages/forgot-password/reset.svelte";
import PrescriptionsPage from "../pages/prescriptions.svelte";
import BioDataPage from "../pages/bio-data.svelte";
import NewAppointmentPage from "../pages/appointment/new-appointment.svelte";
import ViewAppointmentPage from "../pages/appointment/view-appointment.svelte";
import AllAppointmentsPage from "../pages/appointment/all-appointments.svelte";
import SettingsPage from "../pages/settings.svelte";
import TwoFactorAuthPage from "../pages/2fa.svelte";
import SubscriptionsPage from "../pages/subscription.svelte";
import TestsPage from "../pages/tests.svelte";

const routes = [
  {
    path: '/',
    component: HomePage,
  },
    {
      path: '/login',
      component: LoginPage,
      options: {
        transition: 'f7-cover',
      },
    },
  {
    path: '/register',
    component: RegisterPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/request-forget-password',
    component: RequestForgetPassword,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/prescriptions',
    component: PrescriptionsPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/bio-data',
    component: BioDataPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/new-appointment',
    component: NewAppointmentPage,
    options: {
      transition: 'f7-cover-v',
    },
  },
  {
    path: '/all-appointments',
    component: AllAppointmentsPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/appointment/:id',
    component: ViewAppointmentPage,
    options: {
      transition: 'f7-cover-v',
    },
  },
  {
    path: '/settings',
    component: SettingsPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/2fa',
    component: TwoFactorAuthPage,
    options: {
      transition: 'f7-cover-v',
    },
  },
  {
    path: '/subscriptions',
    component: SubscriptionsPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '/tests',
    component: TestsPage,
    options: {
      transition: 'f7-cover',
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
