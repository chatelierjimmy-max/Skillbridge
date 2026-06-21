import ChunkLoadErrorBoundary from "./components/ChunkLoadErrorBoundary";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <ChunkLoadErrorBoundary>
      <AppRouter />
    </ChunkLoadErrorBoundary>
  );
}
