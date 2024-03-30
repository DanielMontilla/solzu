import { component$, useStyles$ } from "@builder.io/qwik";
import Icon from "~/components/icons";
import styles from "./styles.css?inline";

import { ThemeToggle } from "./theme-toggle";
import { LanguageSelect } from "./language-select";

export const Header = component$(() => {
  useStyles$(styles);
  return (
    <nav class="navbar flex items-center justify-between border-b border-white/20 bg-base-100 py-3">
      <div class="flex items-center justify-start space-x-2">
        <button class="btn btn-ghost text-2xl">Solzu</button>
        <div class="form-control relative">
          <input
            type="text"
            placeholder="Search"
            class="input input-bordered input-ghost z-10 w-[256px] -translate-y-[1px] pl-10 text-lg focus:bg-transparent"
          />
          <div class="kbd-wrapper absolute right-0 top-0 flex h-full items-center justify-start pr-2 opacity-80 transition-opacity">
            <kbd class="kbd kbd-sm">ctrl</kbd>+<kbd class="kbd kbd-sm">k</kbd>
          </div>
          <div class="absolute left-0 top-0 flex h-full items-center justify-start pl-2">
            <Icon.Search class="h-7 w-7" />
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end space-x-2">
        <LanguageSelect />
        <ThemeToggle />
      </div>
    </nav>
  );
});
