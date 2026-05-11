import React, { useRef } from "react";
import { Autorun, ClearWatchers } from "../observableProxy/autorun/autorun";

export const getObserverHoc = (autorun: Autorun) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <C extends React.FC<any>>(Component: C): C =>
    ((props) => {
      const oldDispose = useRef<ClearWatchers>(() => {});
      oldDispose.current();
      const [_, forceUpdate] = React.useState(Symbol());
      const { dispose, result: component } = autorun.reactionOnce(
        () => Component(props),
        () => {
          oldDispose.current()
          forceUpdate(Symbol());
        }
      );
      oldDispose.current = dispose;


      return component;
    }) as C;