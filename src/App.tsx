import { type Component, lazy } from 'solid-js';
import { Routes, Route } from '@solidjs/router';
import { Toaster } from 'solid-toast';

const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const RegisterMerchant = lazy(() => import('./pages/RegisterMerchant'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

const Main = lazy(() => import('./pages/Main'));

const Profile = lazy(() => import('./pages/Profile'));

const Canlendar = lazy(() => import('./pages/Calendar/Index'));
const AppointmentAdd = lazy(() => import('./pages/Calendar/AppointmentAdd'));
const AppointmentShow = lazy(() => import('./pages/Calendar/AppointmentShow'));

const Members = lazy(() => import('./pages/Member/Members'));
const MemberInfo = lazy(() => import('./pages/Member/MemberInfo'));

const Orders = lazy(() => import('./pages/Statistic/Orders'));
const RechargeRecord = lazy(() => import('./pages/Statistic/RechargeRecords'));

const Barbers = lazy(() => import('./pages/Setting/Barber/Barbers'));
const BarberInfo = lazy(() => import('./pages/Setting/Barber/BarberInfo'));

const ServiceTypes = lazy(() => import('./pages/Setting/ServiceType/ServiceTypes'));
const ServiceTypeInfo = lazy(() => import('./pages/Setting/ServiceType/ServiceTypeInfo'));
const App: Component = () => {
  return (
    <>
      <Toaster position="top-center" gutter={8} toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" component={Index} />
        <Route path="/login" component={Login} />
        <Route path="/register-merchant" component={RegisterMerchant} />
        <Route path="/forget-password" component={ResetPassword} />
        <Route path="/" component={Main}>
          <Route path="/profile" component={Profile} />
          <Route path="/calendar" component={Canlendar} />
          <Route path="/members" component={Members} />
          <Route path="/orders" component={Orders} />
          <Route path="/recharge-records" component={RechargeRecord} />
          <Route path="/barbers" component={Barbers} />
          <Route path="/barber-info" component={BarberInfo} />
          <Route path="/service-types" component={ServiceTypes} />
          <Route path="/service-type-info" component={ServiceTypeInfo} />
        </Route>
        <Route path="/member-info" component={MemberInfo} />
        <Route path="/appointment-add" component={AppointmentAdd} />
        <Route path="/appointment-show" component={AppointmentShow} />
      </Routes>
    </>
  );
};

export default App;
