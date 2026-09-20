import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMap from './pages/citizen/MainMap';
import Header from './components/Header';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import OAuthCallback from './pages/auth/OAuthCallback';
import Report from "./pages/citizen/Report";
import MyReports from "./pages/citizen/MyReports";
import Inquiry from "./pages/citizen/Inquiry";
import InquiryNew from "./pages/citizen/InquiryNew";
import FindId from './pages/auth/FindId';
import FindPassword from './pages/auth/FindPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPriority from './pages/admin/AdminPriority';
import AdminReportDetail from './pages/admin/AdminReportDetail';
import AdminMembers from './pages/admin/AdminMembers';
import AdminReports from './pages/admin/AdminReports';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminRoadDetail from './pages/admin/AdminRoadDetail';
import RequireAdmin from './components/auth/RequireAdmin';
import RequireAuth from './components/auth/RequireAuth';
import RedirectAdminHome from './components/auth/RedirectAdminHome';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

function App() {

  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    libraries: ['services'],
  });
  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />

        <Route element={<RequireAuth />}>
          <Route element={<RedirectAdminHome />}>
            <Route path="/" element={<MainMap />} />
          </Route>
          <Route path="/report" element={<Report />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/inquiry/new" element={<InquiryNew />} />
        </Route>

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
          <Route path="/admin/priority" element={<AdminPriority />} />
          <Route path="/admin/roads/:id" element={<AdminRoadDetail />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;