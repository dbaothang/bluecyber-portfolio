import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiMail, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const UserProfile = ({ user }) => {
  const { userId } = useParams();
  const [portfolioUser, setPortfolioUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/profile/${userId}`);
        setPortfolioUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else if (user) {
      setPortfolioUser(user);
      setLoading(false);
    }
  }, [userId, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!portfolioUser) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {portfolioUser.profileImage ? (
          <img
            src={portfolioUser.profileImage}
            alt={portfolioUser.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
            {portfolioUser.name.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{portfolioUser.name}</h1>
          <p className="text-lg text-gray-600 mb-4">{portfolioUser.jobTitle}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{portfolioUser.bio}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              <FiMail />
              Contact
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <FiGithub />
              GitHub
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <FiLinkedin />
              LinkedIn
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <FiTwitter />
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
