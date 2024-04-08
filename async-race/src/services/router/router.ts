import ROUTES from "./routes";

const router: () => void = () => {
  const path: string = window.location.hash.slice(1).toLowerCase() || "/";
  const redirectTo: (() => void) | undefined = ROUTES.get(path);
  if (redirectTo) redirectTo();
};
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
export default router;
