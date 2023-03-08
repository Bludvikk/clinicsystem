import { createReactQueryHooks } from "@trpc/react-query";

import type { ServerRouter } from "../../server/router/AuthRouter";

export const trpc = createReactQueryHooks<ServerRouter>();