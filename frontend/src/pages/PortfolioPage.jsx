import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserProfile from "../components/portfolio/UserProfile";
import ProjectCard from "../components/portfolio/ProjectCard";
import ContactButton from "../components/portfolio/ContactButton";

const PortfolioPage = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/user/profile/${userId}`);
        const projectsResponse = await axios.get(
          `/api/user/projects/${userId}`
        );

        setUser(response.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleContactSubmit = async (formData) => {
    try {
      await axios.post(`/api/contact/${userId}`, formData);
      alert("Your message has been sent successfully!");
      setShowContactForm(false);
    } catch (error) {
      console.error("Error sending contact:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

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
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* <div className="flex justify-center">
        <button
          onClick={() => setShowContactForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Contact {user.name}
        </button>
      </div> */}

      {showContactForm && (
        <ContactButton
          onSubmit={handleContactSubmit}
          onCancel={() => setShowContactForm(false)}
        />
      )}

      <div className="mt-12 text-center text-gray-500 text-sm">
        Powered by DevPort
      </div>
    </div>
  );
};

export default PortfolioPage;
