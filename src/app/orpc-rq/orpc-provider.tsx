"use client";

import { createContext, ReactNode, use, useState } from "react";
import { createORPCReactQueryUtils, RouterUtils } from "@orpc/react-query";
import { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { router } from "./add-post.api";
import { RPCLink } from "@orpc/client/fetch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type ORPCReactUtils = RouterUtils<RouterClient<typeof router>>;

export const ORPCContext = createContext<ORPCReactUtils | undefined>(undefined);

export function useORPC(): ORPCReactUtils {
  const orpc = use(ORPCContext);
  if (!orpc) {
    throw new Error("ORPCContext is not set up properly");
  }
  return orpc;
}

const link = new RPCLink({
  url: "http://localhost:3000/rpc",
});

export function ORPCProvider({ children }: { children: ReactNode }) {
  const [orpcClient] = useState<RouterClient<typeof router>>(() =>
    createORPCClient(link),
  );
  const [orpc] = useState(() => createORPCReactQueryUtils(orpcClient));
  const [queryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <ORPCContext.Provider value={orpc}>{children}</ORPCContext.Provider>
    </QueryClientProvider>
  );
}
