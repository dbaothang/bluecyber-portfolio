import { useEffect, useState } from "react";
import ProfileSettings from "../components/settings/ProfileSettings";
import ProjectSettings from "../components/settings/ProjectSettings";
import api from "./../api";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(headers);
        const userResponse = await api.get("/user/profile", { headers });
        const projectsResponse = await api.get("/user/projects", {
          headers,
        });

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

  const handleUpdateProfile = async (formData) => {
    try {
      // Không cần gọi lại API ở đây vì đã gọi trong ProfileSettings
      // Chỉ cần cập nhật state với dữ liệu trả về từ API
      const { data } = await api.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error; // Ném lỗi để xử lý ở component con
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const { data } = await api.post("/user/projects", projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects([...projects, data]);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const { data } = await api.put(
        `/user/projects/${projectId}`,
        projectData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
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
