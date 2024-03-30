import { job } from "./job";
import * as R from "./result";
import { Procedure } from "./types";

const t = job().set(R.FromTryCatch(() => 10));
// .ql(R.map());
