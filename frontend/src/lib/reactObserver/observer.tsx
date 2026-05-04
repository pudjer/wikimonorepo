/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from "react";
import { Autorun, ClearWatchers } from "../observableProxy/autorun/autorun";

export const getObserverHoc = (autorun: Autorun) =>
  <C extends React.FC>(Component: C): C =>
    ((props) => {
      const oldDispose = useRef<ClearWatchers>(() => {});
      oldDispose.current();
      const [_, forceUpdate] = React.useState(Symbol());
      const { dispose, result: component } = autorun.reaction(
        () => Component(props),
        () => {
          oldDispose.current()
          forceUpdate(Symbol());
        }
      );
      oldDispose.current = dispose;


      return component;
    }) as C;