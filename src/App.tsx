import { Suspense } from "react";
import { ScrollTopButton } from "./components/common/scroll.top.com";
import Loading from "./app/screens/Loading";
import { useSelector } from "react-redux";
import RunRoutes from "./routes/run/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryProvider } from "./providers/QueryProvider";

export const App = () => {
  const isLoading = useSelector((state: any) => state.loading);

  return (
    <QueryProvider>
      {isLoading && <Loading />}
      <Suspense>
        <RunRoutes />
      </Suspense>
      <ScrollTopButton />
      <ToastContainer />
    </QueryProvider>
  );
};