import fetch from "isomorphic-unfetch";
import hookNeedingFetch from "./hookNeedingFetch";

export const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const projects = res.ok ? await res.json() : null;
    return projects;
};
  
export const useFetchProjects = () => hookNeedingFetch(fetchProjects);