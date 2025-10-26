import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog.tsx", [
    index("routes/blogIndex.tsx"),
    route(":slug", "routes/blogSlug.tsx"),
  ]),
] satisfies RouteConfig;
