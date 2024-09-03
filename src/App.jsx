import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/landing";
import JobListing from "./pages/job-listing";
import JobPage from "./pages/job";
import PostJob from "./pages/post-job";
import SavedJob from "./pages/saved-job";
import MyJobs from "./pages/my-jobs";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./components/protected-route";
import Onboarding from "./pages/onboarding";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <LandingPage />,
        path: "/",
      },
      {
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
        path: "/onboarding",
      },
      {
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
        path: "/jobs",
      },
      {
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
        path: "/job/:id",
      },
      {
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
        path: "/post-job",
      },
      {
        element: (
          <ProtectedRoute>
            <SavedJob />
          </ProtectedRoute>
        ),
        path: "/saved-jobs",
      },
      {
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
        path: "/my-jobs",
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
