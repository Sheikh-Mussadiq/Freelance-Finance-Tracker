import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isValid } from "date-fns";
import { useData } from "../../context/DataContext";
import Tooltip from "../ui/Tooltip";
import InvoiceModal from "./InvoiceModal";
import { AddIcon } from "../icons/Icons";
import EmptyState from "../ui/EmptyState";
import { ProjectsEmptyIcon, SearchEmptyIcon } from "../icons/EmptyStateIcons";
import ProjectFormModal from "./ProjectFormModal";
import PaymentModal from "./PaymentModal";
import HoursLogModal from "./HoursLogModal";
import ContractDetailsModal from "./ContractDetailsModal";
import Badge from "../ui/Badge";
import {
  EditIcon,
  DeleteIcon,
  PaymentIcon,
  ClockIcon,
  ContractIcon,
} from "../icons/Icons";

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const ProjectList = ({ projects, searchTerm }) => {
  const { updateProject, deleteProject, addPayment, updateHours } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isContractDetailsOpen, setIsContractDetailsOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper to get contract type display
  const getContractTypeDisplay = (project) => {
    if (project.contractType === "hourly") {
      return `Hourly (${formatCurrency(project.hourlyRate)}/hr)`;
    } else if (project.contractType === "monthly") {
      return `Monthly (${formatCurrency(project.monthlyRate)}/mo)`;
    } else {
      return "Fixed Price";
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const openPaymentModal = (project) => {
    setCurrentProject(project);
    setIsPaymentModalOpen(true);
  };

  const openHoursModal = (project) => {
    if (project.contractType !== "hourly") return;

    setCurrentProject(project);
    setIsHoursModalOpen(true);
  };

  const openContractDetails = (project) => {
    setCurrentProject(project);
    setIsContractDetailsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsInvoiceModalOpen(false);
    setIsAddModalOpen(false);
    setIsContractDetailsOpen(false);
    setIsHoursModalOpen(false);
    setCurrentProject(null);
  };

  const openInvoiceModal = (project) => {
    setCurrentProject(project);
    setIsInvoiceModalOpen(true);
  };

  const handleProjectUpdate = (projectData) => {
    if (currentProject) {
      updateProject({
        ...currentProject,
        ...projectData,
      });
    }
    closeModal();
  };

  const handlePaymentSubmit = (paymentData) => {
    if (currentProject) {
      addPayment(currentProject.id, paymentData);
      closeModal();
    }
  };

  const handleHoursSubmit = (hours) => {
    if (currentProject && currentProject.contractType === "hourly") {
      updateHours(currentProject.id, hours);
      closeModal();
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  return (
    <>
      <motion.div
        className="overflow-x-auto"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Client
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contract Type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Value
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    icon={ProjectsEmptyIcon}
                    title="No projects yet"
                    description="Start tracking your freelance work by adding your first project."
                    action={
                      <button
                        onClick={openAddModal}
                        className="btn-primary inline-flex items-center space-x-2"
                        type="button"
                      >
                        <AddIcon />
                        <span>Add Project</span>
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex flex-col">
                      <span>{project.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.startDate &&
                        isValid(new Date(project.startDate))
                          ? format(new Date(project.startDate), "MMM d, yyyy")
                          : "Invalid date"}{" "}
                        -
                        {project.endDate && isValid(new Date(project.endDate))
                          ? format(new Date(project.endDate), " MMM d, yyyy")
                          : " Ongoing"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {project.client}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => openContractDetails(project)}
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 transition-colors duration-200 p-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900"
                    >
                      <span className="mr-1">
                        {getContractTypeDisplay(project)}
                      </span>
                      <ContractIcon />
                    </button>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm">
                    <Badge
                      variant={
                        project.status === "completed"
                          ? "success"
                          : project.status === "in-progress"
                          ? "info"
                          : "warning"
                      }
                    >
                      {project.status === "in-progress"
                        ? "In Progress"
                        : project.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(project.totalAmount)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                    {formatCurrency(project.paidAmount)}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <span
                      className={`${
                        project.totalAmount - project.paidAmount > 0
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {formatCurrency(project.totalAmount - project.paidAmount)}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {project.contractType === "hourly" && (
                        <Tooltip content="Log Hours">
                          <button
                            onClick={() => openHoursModal(project)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            <ClockIcon />
                          </button>
                        </Tooltip>
                      )}
                      <Tooltip content="Generate Invoice">
                        <button
                          onClick={() => openInvoiceModal(project)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                      <Tooltip content="Add Payment">
                        <button
                          onClick={() => openPaymentModal(project)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
                        >
                          <PaymentIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Edit Project">
                        <button
                          onClick={() => openEditModal(project)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Project">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <DeleteIcon />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">
                  <EmptyState
                    icon={SearchEmptyIcon}
                    title="No matching projects"
                    description="Try adjusting your search terms or filters to find what you're looking for."
                    size="small"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentProject={currentProject}
        onSubmit={handleProjectUpdate}
      />

      {/* Add Project Modal */}
      <ProjectFormModal
        isOpen={isAddModalOpen}
        onClose={closeModal}
        currentProject={null}
        onSubmit={handleProjectUpdate}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={closeModal}
        project={currentProject}
        onSubmit={handlePaymentSubmit}
      />

      {/* Hours Log Modal */}
      <HoursLogModal
        isOpen={isHoursModalOpen}
        onClose={closeModal}
        project={currentProject}
        onSubmit={handleHoursSubmit}
      />

      {/* Contract Details Modal */}
      <ContractDetailsModal
        isOpen={isContractDetailsOpen}
        onClose={closeModal}
        project={currentProject}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={closeModal}
        project={currentProject}
        payments={currentProject?.payments || []}
      />
    </>
  );
};

export default ProjectList;
