import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="w-full min-h-screen flex justify-center bg-white">
      <div className="w-full max-w-md bg-white">
        <AppRoutes />
      </div>
    </div>
  );
}
