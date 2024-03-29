import ROUTES from "./routes";

const router = () => {
  const path = window.location.hash.slice(1).toLowerCase() || "/";
  console.log(path);
  const redirectTo = ROUTES.get(path);
  if (redirectTo) redirectTo();
};
window.addEventListener("hashchange", router);
window.addEventListener("load", router);
export default router;
