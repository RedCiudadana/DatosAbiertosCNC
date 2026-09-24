import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Public pages
import { HomePage } from '@/pages/public/HomePage';
import { ExplorePage } from '@/pages/public/ExplorePage';
import { DatasetDetailPage } from '@/pages/public/DatasetDetailPage';
import { UseCasesPage } from '@/pages/public/UseCasesPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { MapaDatosPage } from '@/pages/public/MapaDatosPage';
import { MetodologiaPage } from '@/pages/public/MetodologiaPage';
import { HistoriasPage } from '@/pages/public/HistoriasPage';
import { HistoriaDetailPage } from '@/pages/public/HistoriaDetailPage';
import { BrechasPage } from '@/pages/public/BrechasPage';

// Admin pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminDatasetsListPage } from '@/pages/admin/AdminDatasetsListPage';
import { AdminDatasetEditPage } from '@/pages/admin/AdminDatasetEditPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminInstitutionsPage } from '@/pages/admin/AdminInstitutionsPage';
import { AdminStatusesPage } from '@/pages/admin/AdminStatusesPage';
import { AdminTagsPage } from '@/pages/admin/AdminTagsPage';
import { AdminUseCasesPage } from '@/pages/admin/AdminUseCasesPage';
import { AdminResourcesPage } from '@/pages/admin/AdminResourcesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminImportPage } from '@/pages/admin/AdminImportPage';
import { AdminIntegrityDomainsPage } from '@/pages/admin/AdminIntegrityDomainsPage';
import { AdminDataStoriesPage } from '@/pages/admin/AdminDataStoriesPage';
import { AdminFeedbackPage } from '@/pages/admin/AdminFeedbackPage';
import { AdminOpeningAgendaPage } from '@/pages/admin/AdminOpeningAgendaPage';
import { AdminIdentifiersPage } from '@/pages/admin/AdminIdentifiersPage';
import { AdminAssessmentsPage } from '@/pages/admin/AdminAssessmentsPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/explorar" element={<PublicLayout><ExplorePage /></PublicLayout>} />
          <Route path="/datasets/:slug" element={<PublicLayout><DatasetDetailPage /></PublicLayout>} />
          <Route path="/mapa-datos" element={<PublicLayout><MapaDatosPage /></PublicLayout>} />
          <Route path="/metodologia" element={<PublicLayout><MetodologiaPage /></PublicLayout>} />
          <Route path="/historias" element={<PublicLayout><HistoriasPage /></PublicLayout>} />
          <Route path="/historias/:slug" element={<PublicLayout><HistoriaDetailPage /></PublicLayout>} />
          <Route path="/brechas" element={<PublicLayout><BrechasPage /></PublicLayout>} />
          <Route path="/casos-de-uso" element={<PublicLayout><UseCasesPage /></PublicLayout>} />
          <Route path="/acerca" element={<PublicLayout><AboutPage /></PublicLayout>} />

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/datasets" element={<AdminLayout><AdminDatasetsListPage /></AdminLayout>} />
          <Route path="/admin/datasets/new" element={<AdminLayout><AdminDatasetEditPage /></AdminLayout>} />
          <Route path="/admin/datasets/:id" element={<AdminLayout><AdminDatasetEditPage /></AdminLayout>} />
          <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesPage /></AdminLayout>} />
          <Route path="/admin/institutions" element={<AdminLayout><AdminInstitutionsPage /></AdminLayout>} />
          <Route path="/admin/resources" element={<AdminLayout><AdminResourcesPage /></AdminLayout>} />
          <Route path="/admin/use-cases" element={<AdminLayout><AdminUseCasesPage /></AdminLayout>} />
          <Route path="/admin/tags" element={<AdminLayout><AdminTagsPage /></AdminLayout>} />
          <Route path="/admin/statuses" element={<AdminLayout><AdminStatusesPage /></AdminLayout>} />
          <Route path="/admin/import" element={<AdminLayout><AdminImportPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
          <Route path="/admin/integrity-domains" element={<AdminLayout><AdminIntegrityDomainsPage /></AdminLayout>} />
          <Route path="/admin/data-stories" element={<AdminLayout><AdminDataStoriesPage /></AdminLayout>} />
          <Route path="/admin/feedback" element={<AdminLayout><AdminFeedbackPage /></AdminLayout>} />
          <Route path="/admin/opening-agenda" element={<AdminLayout><AdminOpeningAgendaPage /></AdminLayout>} />
          <Route path="/admin/identifiers" element={<AdminLayout><AdminIdentifiersPage /></AdminLayout>} />
          <Route path="/admin/assessments" element={<AdminLayout><AdminAssessmentsPage /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
