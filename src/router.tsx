import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  const origGetMatchedRoutes = router.getMatchedRoutes.bind(router);
  router.getMatchedRoutes = ((pathname: string) => {
    if (router.serverSsr && typeof (router.serverSsr as any).takeBufferedScripts !== "function") {
      (router.serverSsr as any).takeBufferedScripts = () => undefined;
    }
    const result = origGetMatchedRoutes(pathname) as any;
    if (result && !Array.isArray(result) && typeof result === "object") {
      const arr = [result.matchedRoutes, result.routeParams, result.foundRoute] as any;
      Object.assign(arr, result);
      return arr;
    }
    return result;
  }) as typeof router.getMatchedRoutes;

  let _serverSsr = (router as any).serverSsr;
  Object.defineProperty(router, "serverSsr", {
    get() {
      if (_serverSsr && typeof _serverSsr.takeBufferedScripts !== "function") {
        _serverSsr.takeBufferedScripts = () => undefined;
      }
      return _serverSsr;
    },
    set(val) {
      if (val && typeof val.takeBufferedScripts !== "function") {
        val.takeBufferedScripts = () => undefined;
      }
      _serverSsr = val;
    },
    configurable: true,
    enumerable: true,
  });

  return router;
};
