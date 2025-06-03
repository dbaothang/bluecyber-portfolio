import { FiGithub, FiExternalLink } from "react-icons/fi";

const ProjectCard = ({ project, isOwner = false, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {project.image && (
          <div className="w-full md:w-1/3">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className={`${project.image ? "md:w-2/3" : "w-full"}`}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            {isOwner && (
              <button
                onClick={() => onEdit(project)}
                className="text-primary hover:text-primary-dark"
              >
                Edit
              </button>
            )}
          </div>

          <p className="text-gray-700 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-4">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary-dark"
              >
                <FiGithub />
                Repository
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary-dark"
              >
                <FiExternalLink />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
