import { getAllLabEntries } from "@/lib/data/lab";
import { getAllProjects } from "@/lib/data/projects";
import { getAllPosts } from "@/lib/data/posts";
import { siteConfig } from "@/lib/config/site";

const now = new Date();

function route(pathname, priority, changeFrequency = "monthly") {
  return {
    url: `${siteConfig.url}${pathname}`,
    lastModified: now,
    changeFrequency,
    priority,
  };
}

export default function sitemap() {
  const baseRoutes = [
    route("/", 1, "monthly"),
    route("/projects", 0.9, "weekly"),
    route("/writing", 0.8, "weekly"),
    route("/lab", 0.7, "monthly"),
    route("/about", 0.7, "monthly"),
    route("/contact", 0.6, "monthly"),
  ];

  const projectRoutes = getAllProjects().map((project) =>
    route(`/projects/${project.slug}`, 0.8, "monthly"),
  );

  const labRoutes = getAllLabEntries().map((entry) =>
    route(`/lab/${entry.slug}`, 0.6, "monthly"),
  );

  const writingRoutes = getAllPosts().map((post) => ({
    ...route(`/writing/${post.slug}`, 0.7, "weekly"),
    lastModified: new Date(post.published),
  }));

  return [...baseRoutes, ...projectRoutes, ...labRoutes, ...writingRoutes];
}
