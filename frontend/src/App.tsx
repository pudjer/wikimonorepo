import { useEffect } from "react";
import { use } from "./store/UsageExample";

export default function App() {
  useEffect(() => {
    use()
  })
  return <div>hi</div>;
}

