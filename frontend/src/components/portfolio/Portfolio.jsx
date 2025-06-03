import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserProfile from "../components/portfolio/UserProfile";
import ProjectCard from "../components/portfolio/ProjectCard";
import ContactButton from "../components/portfolio/ContactButton";

const Portfolio = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`/api/user/profile/${userId}`);
        const projectsResponse = await axios.get(
          `/api/user/projects/${userId}`
        );

        setUser(userResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <UserProfile user={user} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet.</p>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={false} // Không phải chủ sở hữu (view mode)
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <ContactButton userId={userId} />
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        Powered by DevPort
      </div>
    </div>
  );
};

export default Portfolio;
