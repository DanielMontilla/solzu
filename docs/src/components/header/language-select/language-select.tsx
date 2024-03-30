import { component$ } from "@builder.io/qwik";
import Icon from "~/components/icons";

export const LanguageSelect = component$(() => {
  return (
    <div class="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        class="option-dropdown btn btn-ghost m-0 px-2"
      >
        <Icon.Language class="h-6 w-6" />
        <Icon.Dropdown class="h-4 w-4" />
      </div>
      <ul
        tabIndex={0}
        class="menu dropdown-content z-[1] w-52 rounded-md border border-white/10 bg-base-100 p-2 shadow-md"
      >
        <li>
          <a>En</a>
        </li>
        <li>
          <a>Es</a>
        </li>
      </ul>
    </div>
  );
});
