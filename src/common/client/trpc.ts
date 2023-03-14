import { createReactQueryHooks } from "@trpc/react-query";

import type { ServerRouter } from "../../server/routers";

export const trpc = createReactQueryHooks<ServerRouter>();
