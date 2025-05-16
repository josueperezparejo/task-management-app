import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: Props) => {
  return (
    <Fragment>
      <ToastContainer />
      <Toaster />

      {children}
    </Fragment>
  );
};
