import { component$, $ } from "@builder.io/qwik";
import Icon from "~/components/icons";

export const ThemeToggle = component$(() => {
  const onChange = $((_: Event, { checked }: HTMLInputElement) => {
    console.log(checked);
  });

  return (
    <label class="swap swap-rotate">
      <input type="checkbox" class="theme-controller" onChange$={onChange} />
      <Icon.DarkMode class="swap-on h-7 w-7 fill-current" />
      <Icon.LightMode class="swap-off h-7 w-7 fill-current" />
    </label>
  );
});
