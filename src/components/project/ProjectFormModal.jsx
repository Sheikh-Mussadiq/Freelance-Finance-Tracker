import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { format, addWeeks, differenceInWeeks } from "date-fns";

const ProjectFormModal = ({ isOpen, onClose, currentProject, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    totalAmount: "",
    status: "in-progress",
    startDate: "",
    endDate: "",
    contractType: "fixed",
    paymentTerms: "milestone",
    hourlyRate: "",
    monthlyRate: "",
    contractDuration: "",
  });

  // Initialize form data when currentProject changes
  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name || "",
        client: currentProject.client || "",
        totalAmount: currentProject.totalAmount || "",
        status: currentProject.status || "in-progress",
        startDate: currentProject.startDate || "",
        endDate: currentProject.endDate || "",
        contractType: currentProject.contractType || "fixed",
        paymentTerms: currentProject.paymentTerms || "milestone",
        hourlyRate: currentProject.hourlyRate || "",
        monthlyRate: currentProject.monthlyRate || "",
        contractDuration: currentProject.contractDuration || "",
      });
    } else {
      // Reset form for new project
      setFormData({
        name: "",
        client: "",
        totalAmount: "",
        status: "in-progress",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        contractType: "fixed",
        paymentTerms: "milestone",
        hourlyRate: "",
        monthlyRate: "",
        contractDuration: "",
      });
    }
  }, [currentProject, isOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "contractType") {
      // Reset irrelevant fields when changing contract type
      if (value === "fixed") {
        setFormData({
          ...formData,
          contractType: value,
          hourlyRate: "",
          monthlyRate: "",
        });
      } else if (value === "hourly") {
        setFormData({
          ...formData,
          contractType: value,
          monthlyRate: "",
        });
      } else if (value === "monthly") {
        setFormData({
          ...formData,
          contractType: value,
          hourlyRate: "",
        });
      }
    } else if (name === "startDate") {
      // Calculate end date based on contract duration
      const startDate = new Date(value);
      let endDate = null;
      if (formData.contractDuration) {
        endDate = addWeeks(startDate, parseInt(formData.contractDuration, 10));
      }

      setFormData({
        ...formData,
        startDate: value,
        endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      });
    } else if (name === "endDate" && formData.startDate) {
      // Auto-calculate contract duration when end date changes
      const startDate = new Date(formData.startDate);
      const endDate = new Date(value);
      const duration = differenceInWeeks(endDate, startDate);

      setFormData({
        ...formData,
        endDate: value,
        contractDuration: duration > 0 ? duration : "",
      });
    } else if (name === "contractDuration" && formData.startDate) {
      // Auto-calculate end date when duration changes
      const startDate = new Date(formData.startDate);
      let endDate = null;
      if (value) {
        endDate = addWeeks(startDate, parseInt(value, 10));
      }

      setFormData({
        ...formData,
        contractDuration: value,
        endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      });
    } else if (
      name === "totalAmount" ||
      name === "hourlyRate" ||
      name === "monthlyRate"
    ) {
      // Special handling for numeric fields
      setFormData({
        ...formData,
        [name]: value === "" ? "" : parseFloat(value) || 0,
      });
    } else {
      // Default handler for other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Form data: ", formData);

    try {
      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = formData.endDate ? new Date(formData.endDate) : null;

      if (isNaN(startDate.getTime())) {
        throw new Error("Invalid start date");
      }

      if (endDate && isNaN(endDate.getTime())) {
        throw new Error("Invalid end date");
      }

      // Prepare data based on contract type
      const projectData = {
        name: formData.name,
        client: formData.client,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        contractType: formData.contractType,
        paymentTerms: formData.paymentTerms,
        contractDuration: formData.contractDuration,
      };

      // Add contract type specific data
      if (projectData.contractType === "hourly") {
        // For hourly contracts
        projectData.hourlyRate = parseFloat(formData.hourlyRate) || 0;
        projectData.totalAmount = 0;
      } else if (projectData.contractType === "monthly") {
        // For monthly contracts
        projectData.monthlyRate = parseFloat(formData.monthlyRate) || 0;
        projectData.totalAmount = 0;
      } else {
        // For fixed contracts
        projectData.totalAmount = parseFloat(formData.totalAmount) || 0;
      }

      console.log("Submitting project:", projectData);
      onSubmit(projectData);
    } catch (error) {
      console.error("Error preparing project data:", error);
      alert("Error creating project: " + error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentProject ? "Edit Project" : "Add New Project"}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Project Details Section */}
          <div className="pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Project Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="label">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="client" className="label">
                  Client
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="input"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contract Terms Section */}
          <div className="pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Contract Terms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contractType" className="label">
                  Contract Type
                </label>
                <select
                  id="contractType"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleFormChange}
                  className="input"
                  required
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="monthly">Monthly Rate</option>
                </select>
              </div>
              <div>
                <label htmlFor="paymentTerms" className="label">
                  Payment Terms
                </label>
                <select
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleFormChange}
                  className="input"
                  required
                >
                  <option value="milestone">Milestone-based</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="half-upfront">50% Upfront</option>
                  <option value="full-upfront">100% Upfront</option>
                  <option value="upon-completion">Upon Completion</option>
                </select>
              </div>

              {formData.contractType === "fixed" && (
                <div>
                  <label htmlFor="totalAmount" className="label">
                    Total Amount ($)
                  </label>
                  <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleFormChange}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}

              {formData.contractType === "hourly" && (
                <div>
                  <label htmlFor="hourlyRate" className="label">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleFormChange}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}

              {formData.contractType === "monthly" && (
                <div>
                  <label htmlFor="monthlyRate" className="label">
                    Monthly Rate ($)
                  </label>
                  <input
                    type="number"
                    id="monthlyRate"
                    name="monthlyRate"
                    value={formData.monthlyRate}
                    onChange={handleFormChange}
                    className="input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
              Project Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="startDate" className="label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label htmlFor="contractDuration" className="label">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  id="contractDuration"
                  name="contractDuration"
                  value={formData.contractDuration}
                  onChange={handleFormChange}
                  className="input"
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {currentProject ? "Update Project" : "Add Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
