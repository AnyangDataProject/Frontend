import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMap from './pages/MainMap';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AiAnalysis from "./pages/AiAnalysis";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import Inquiry from "./pages/Inquiry";
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPriority from './pages/admin/AdminPriority';
import AdminReportDetail from './pages/admin/AdminReportDetail';
import AdminMembers from './pages/admin/AdminMembers';
import AdminReports from './pages/admin/AdminReports';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminRoadDetail from './pages/admin/AdminRoadDetail';
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
        <Route path="/" element={<MainMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai-analysis" element={<AiAnalysis />} />
        <Route path="/report" element={<Report />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />


        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
        <Route path="/admin/priority" element={<AdminPriority />} />
        <Route path="/admin/roads/:id" element={<AdminRoadDetail />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;