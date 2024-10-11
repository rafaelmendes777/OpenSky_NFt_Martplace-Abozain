import { Fragment, useRef } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from "react-loader-spinner";
import cls from "./loader.module.css";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import React from "react";
export default function LoaderDialog(props) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const modalContent = (
    <div className={cls.modal}>
      <div style={{ margin: "1vh 12vw 2vh 12vw" }}>
        <TailSpin
          className="bg-[#3861FE]"
          heigth={72}
          width={72}
          color="#3861FE"
          ariaLabel="loading"
        />
      </div>
      <div
        style={{ margin: "0vh 0vw 0vh 37%" }}
        className="text-white dark:text-gray-800 text-3xl font-semibold"
      >
        Loading{" "}
      </div>
      <div
        style={{ margin: "3vh 0vw 0vh 33%" }}
        className="text-[#6C71AD] dark:text-gray-600 text-sm"
      >
        Appreciate Your Waiting{" "}
      </div>
    </div>
  );
  if (isBrowser && props.show) {
    return (
      <Fragment>
        {ReactDOM.createPortal(
          <div className={cls.main} />,
          document.getElementById("modal-root")
        )}
        {ReactDOM.createPortal(
          modalContent,
          document.getElementById("modal-root")
        )}
      </Fragment>
    );
  } else {
    return null;
  }
}
