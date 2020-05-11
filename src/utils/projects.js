import fetch from "isomorphic-unfetch";

export const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const projects = res.ok ? await res.json() : null;
    return projects;
  };
  
  export const useFetchProjects = () => {
    const [projects, setProjects] = React.useState({
      projects: null,
      loadingProjects: true,
    });
  
    React.useEffect(() => {
      const fetchData = async () => {
        const projects = await fetchProjects();
        setProjects({ projects, loadingProjects: false });
      };
      fetchData();
    }, []);
  
    return projects;
  };
  