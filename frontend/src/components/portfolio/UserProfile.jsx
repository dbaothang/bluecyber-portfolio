import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiMail } from "react-icons/fi";

const UserProfile = ({ user }) => {
  const { userId } = useParams();
  const [portfolioUser, setPortfolioUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setShowContactForm(false); // Xoá dòng này nếu bạn muốn giữ form mở
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await axios.post(`/api/contact/${portfolioUser._id}`, formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!portfolioUser) return <div>User not found</div>;

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

          {/* Contact Button & Form */}
          <div className="mb-4">
            <button
              onClick={() => {
                setShowContactForm((prev) => !prev);
                setSuccess(false);
                setError(null);
              }}
              className="border-gray-300 bg-red-100 flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiMail />
              Contact
            </button>
          </div>

          {showContactForm && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              {success ? (
                <p className="text-green-600">Message sent successfully!</p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="block text-sm">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 mb-2 text-sm">{error}</div>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
