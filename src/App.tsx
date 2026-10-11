import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import QueuePage from './pages/QueuePage';
import {
  CasesPage,
  CustomersPage,
  FollowUpsPage,
  KnowledgePage,
  MissingRecord,
  SupervisorPage,
  WorkspacePage,
} from './pages/RecordPages';
import { useApp } from './state/AppProvider';
export default function App() {
  const { state } = useApp();
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Navigate to="/queue" replace />} />
        <Route path="queue" element={<QueuePage />} />
        <Route
          path="workspace"
          element={<Navigate to={`/workspace/${state.selectedInteractionId}`} replace />}
        />
        <Route path="workspace/:interactionId" element={<WorkspacePage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId" element={<CustomersPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="cases/:caseId" element={<CasesPage />} />
        <Route path="follow-ups" element={<FollowUpsPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="supervisor" element={<SupervisorPage />} />
        <Route path="*" element={<MissingRecord />} />
      </Route>
    </Routes>
  );
}
