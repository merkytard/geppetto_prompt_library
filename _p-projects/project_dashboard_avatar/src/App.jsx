
    import React from "react";
    import { Routes, Route, Navigate } from "react-router-dom";
    import Layout from "@/components/Layout";
    import ProjectsPage from "@/pages/ProjectsPage";
    import KanbanPage from "@/pages/KanbanPage";
    import BoardPage from "@/pages/BoardPage";
    import JiraPage from "@/pages/JiraPage";
    import NodeBasePage from "@/pages/NodeBasePage";
    import ModulesPage from "@/pages/ModulesPage";
    import SettingsPage from "@/pages/SettingsPage";
    import NotFoundPage from "@/pages/NotFoundPage";
    import { Toaster } from "@/components/ui/toaster";
    import AiChatWidget from "@/components/AiChatWidget";

    function App() {
      return (
        <>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="kanban" element={<KanbanPage />} />
              <Route path="board" element={<BoardPage />} />
              <Route path="jira" element={<JiraPage />} />
              <Route path="nodebase" element={<NodeBasePage />} />
              <Route path="modules" element={<ModulesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <Toaster />
          <AiChatWidget />
        </>
      );
    }

    export default App;
  