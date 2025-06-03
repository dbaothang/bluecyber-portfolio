import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Easy Portfolio for Developer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          As a web developer, having a portfolio is essential for showcasing
          your technical skills and attracting potential clients. A portfolio is
          a museum of your work, with great tech stacks, case studies, and your
          work history.
        </p>
      </div>

      <div className="flex justify-center gap-6">
        <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 text-lg border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
