import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";
import "./common/i18n";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./common/context/AuthContext";
import { useAuth } from "./common/context/useAuth";
import { ThemeProvider } from "./common/context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Create a new router instance with context
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // injected dynamically by RouterProvider
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
