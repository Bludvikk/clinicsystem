import { createReactQueryHooks } from "@trpc/react-query";

import type { ServerRouter } from "../../server/router/router";

export const trpc = createReactQueryHooks<ServerRouter>();
