import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";

render(() => {
  const [count, setCount] = createSignal<number>(0);
  let timer = setInterval(() => setCount((current) => current + 1), 100);
  onCleanup(() => {
    clearInterval(timer);
  });
  return <h1>Hello world {count}</h1>;
}, document.querySelector("#app")!);
