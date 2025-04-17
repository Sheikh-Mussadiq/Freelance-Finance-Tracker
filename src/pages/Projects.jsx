import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { ProjectsEmptyIcon } from "../components/icons/EmptyStateIcons";
import ProjectFormModal from "../components/project/ProjectFormModal";
import ProjectList from "../components/project/ProjectList";
import { AddIcon, FilterIcon } from "../components/icons/Icons";
import { useSearchParams } from "react-router-dom";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Projects = () => {
  const { projects, addProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: "",
    contractType: "",
    dateFrom: "",
    dateTo: "",
  });

  // Check URL params to auto-open modal
  useEffect(() => {
    const shouldOpenModal = searchParams.get("openModal") === "true";
    if (shouldOpenModal) {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProject = (projectData) => {
    console.log("handleAddProject called with:", projectData);
    addProject(projectData);
    closeModal();
  };

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your client projects and track contracts
          </p>
        </div>
        <Button
          variant="primary"
          startIcon={<AddIcon />}
          onClick={openAddModal}
          className="add-project-btn"
        >
          Add Project
        </Button>
      </header>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-4">
          <div className="flex-1 mr-2">
            <input
              type="text"
              placeholder="Search projects by name or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <Button
            variant="outline"
            startIcon={<FilterIcon />}
            className="project-filters"
          >
            Filter
            {(filters.status ||
              filters.contractType ||
              filters.dateFrom ||
              filters.dateTo) && (
              <span className="bg-primary-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-2">
                •
              </span>
            )}
          </Button>
        </div>

        <div className="project-list">
          <ProjectList projects={projects} searchTerm={searchTerm} />
        </div>
      </div>

      {/* Project Form Modal for Adding */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentProject={null}
        onSubmit={handleAddProject}
      />
    </motion.div>
  );
};

export default Projects;
