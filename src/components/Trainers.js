import React, { useState, useEffect, useCallback } from "react";
import {
  getClassCategoryItems,
  addLesson,
  updateLesson,
  deleteLesson,
  isDatabaseEmpty,
  migrateDataToFirestore,
} from "../services/dataService";
import { Plus, Edit2, Trash2, X, Check, AlertTriangle } from "lucide-react";
import "./Trainers.css";

export default function Trainers() {
  const classesList = [
    "class-1",
    "class-2",
    "class-3",
    "class-4",
    "class-5",
    "class-6",
    "class-7",
    "class-8",
    "class-9",
  ];

  // Selected filters
  const [selectedClass, setSelectedClass] = useState("class-1");
  const [selectedCategory, setSelectedCategory] = useState("stories");

  const classNumber = parseInt(selectedClass.replace("class-", ""), 10);
  const categoriesList = [
    { value: "stories", label: "Stories" },
    { value: "roleplays", label: "Roleplays" },
    { value: "skits", label: "Skits" },
    { value: "activities", label: "Activities" },
    { value: "goodThoughts", label: "Good Thoughts" },
    { value: "publicSpeaking", label: "Public Speaking" },
    { value: "stockSentences", label: "Stock Sentences" },
    { value: "actionWords", label: "Action Words" },
  ];
  if (classNumber >= 5 && classNumber <= 9) {
    categoriesList.push({ value: "presentations", label: "Presentations" });
  }

  // Lessons list state
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null); // Null if adding, docId if editing
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null); // { docId, title }

  // Seeding state
  const [isDbEmpty, setIsDbEmpty] = useState(false);
  const [migrating, setMigrating] = useState(false);

  // Check if database has any lessons
  const checkDbStatus = useCallback(() => {
    isDatabaseEmpty().then((empty) => {
      setIsDbEmpty(empty);
    });
  }, []);

  // Load lessons whenever filters change
  const loadLessons = useCallback(() => {
    setLoading(true);
    getClassCategoryItems(selectedClass, selectedCategory)
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load lessons:", err);
        setLoading(false);
      });
  }, [selectedClass, selectedCategory]);

  useEffect(() => {
    loadLessons();
    checkDbStatus();
  }, [loadLessons, checkDbStatus]);

  const handleSeedDatabase = async () => {
    setMigrating(true);
    try {
      await migrateDataToFirestore();
      setIsDbEmpty(false);
      loadLessons();
      alert("Database successfully seeded with local lessons!");
    } catch (err) {
      alert("Seeding database failed. Check browser console for errors.");
      console.error(err);
    } finally {
      setMigrating(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDocId(null);
    // Auto-generate next numeric id
    const nextId = lessons.length > 0 ? Math.max(...lessons.map(l => Number(l.id) || 0)) + 1 : 1;
    setFormId(nextId.toString());
    setFormTitle("");
    setFormContent("");
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lesson) => {
    setEditingDocId(lesson.docId);
    setFormId(lesson.id.toString());
    setFormTitle(lesson.title);
    setFormContent(lesson.content);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formTitle.trim() || !formContent.trim()) {
      setFormError("Title and Content are required.");
      return;
    }

    const numId = Number(formId);
    if (isNaN(numId) || numId <= 0) {
      setFormError("Please enter a valid positive numeric ID.");
      return;
    }

    // Duplicate ID Validation
    if (!editingDocId) {
      const duplicate = lessons.some(l => Number(l.id) === numId);
      if (duplicate) {
        setFormError(`A lesson with ID #${numId} already exists in this Class and Category.`);
        return;
      }
    } else {
      const duplicate = lessons.some(l => Number(l.id) === numId && l.docId !== editingDocId);
      if (duplicate) {
        setFormError(`Another lesson with ID #${numId} already exists in this Class and Category.`);
        return;
      }
    }

    const lessonData = {
      classId: selectedClass,
      category: selectedCategory,
      id: numId,
      title: formTitle.trim(),
      content: formContent.trim(),
    };

    try {
      if (editingDocId) {
        // Edit mode
        await updateLesson(editingDocId, lessonData);
        setFormSuccess("Lesson updated successfully!");
      } else {
        // Add mode
        await addLesson(lessonData);
        setFormSuccess("New lesson added successfully!");
        setIsDbEmpty(false);
      }

      // Reload lessons list and close modal shortly
      loadLessons();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1200);
    } catch (err) {
      setFormError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteClick = (lesson) => {
    setDeleteTarget({ docId: lesson.docId, title: lesson.title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLesson(deleteTarget.docId);
      setDeleteTarget(null);
      loadLessons();
    } catch (err) {
      alert("Failed to delete lesson.");
      console.error(err);
    }
  };

  return (
    <div className="trainer-dashboard container">
      {isDbEmpty && (
        <div className="seed-banner">
          <div className="seed-banner-text">
            <AlertTriangle size={20} />
            <span>
              <strong>Database is empty!</strong> Seed Firestore with the local default lessons to get started.
            </span>
          </div>
          <button 
            className="seed-banner-btn" 
            onClick={handleSeedDatabase}
            disabled={migrating}
          >
            {migrating ? "Seeding..." : "Seed Database"}
          </button>
        </div>
      )}

      <div className="dashboard-header">
        <div>
          <h1 className="heading">Trainer Admin Portal</h1>
          <p className="para">Manage classes, stories, roleplays, skits, and other learning content.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Content
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              const newClass = e.target.value;
              setSelectedClass(newClass);
              const classNum = parseInt(newClass.replace("class-", ""), 10);
              if (classNum < 5 && selectedCategory === "presentations") {
                setSelectedCategory("stories");
              }
            }}
          >
            {classesList.map((cls) => (
              <option key={cls} value={cls}>
                {cls.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Select Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoriesList.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading items from database...</p>
          </div>
        ) : lessons.length > 0 ? (
          <div className="lessons-table-wrapper">
            <table className="lessons-table">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>ID</th>
                  <th>Title</th>
                  <th>Content Preview</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.docId || lesson.id}>
                    <td><strong>#{lesson.id}</strong></td>
                    <td><span className="lesson-title">{lesson.title}</span></td>
                    <td>
                      <p className="lesson-preview">
                        {lesson.content ? lesson.content.substring(0, 120).trim() : ""}...
                      </p>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => handleOpenEditModal(lesson)}
                          title="Edit Lesson"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteClick(lesson)}
                          title="Delete Lesson"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No lessons found for this class and category.</p>
            <button className="add-btn inline" onClick={handleOpenAddModal}>
              Create First Lesson
            </button>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingDocId ? "Edit Lesson Content" : "Add New Lesson"}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {formError && <div className="message error">{formError}</div>}
              {formSuccess && (
                <div className="message success">
                  <Check size={16} /> {formSuccess}
                </div>
              )}

              <div className="form-row">
                <div className="form-group half">
                  <label>Class</label>
                  <input
                    type="text"
                    value={selectedClass.replace("-", " ").toUpperCase()}
                    disabled
                  />
                </div>
                <div className="form-group half">
                  <label>Category</label>
                  <input
                    type="text"
                    value={
                      categoriesList.find((c) => c.value === selectedCategory)?.label ||
                      selectedCategory
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Numeric ID</label>
                  <input
                    type="number"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group half-wide">
                  <label>Lesson Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Meeting a Friend"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Content Text</label>
                <span className="helper-text">
                  For Roleplays/Skits, write lines like: <strong>Riya: Hello!</strong> on new lines.
                </span>
                <textarea
                  rows={12}
                  placeholder="Type the dialog or story paragraphs here..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box confirm">
            <div className="confirm-icon">
              <AlertTriangle size={32} color="#EF4444" />
            </div>
            <h2>Delete Lesson?</h2>
            <p>
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? 
              This action cannot be undone and will immediately remove the content for students.
            </p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>
                Keep Lesson
              </button>
              <button className="btn-delete-confirm" onClick={confirmDelete}>
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
