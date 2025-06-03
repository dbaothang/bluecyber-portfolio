import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSettings from "../components/settings/ProfileSettings";
import ProjectSettings from "../components/settings/ProjectSettings";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/api/user/profile");
        const projectsResponse = await axios.get("/api/user/projects");

        setUser(userResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const { data } = await axios.put("/api/user/profile", updatedData);
      setUser(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const { data } = await axios.post("/api/user/projects", projectData);
      setProjects([...projects, data]);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const { data } = await axios.put(
        `/api/user/projects/${projectId}`,
        projectData
      );
      setProjects(
        projects.map((proj) => (proj._id === projectId ? data : proj))
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProfileSettings user={user} onUpdate={handleUpdateProfile} />
        </div>
        <div>
          <ProjectSettings
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
