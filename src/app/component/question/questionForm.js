"use client";
import React, { useState, useEffect } from "react";
import TimeButton from "@/utils/timebutton";
import Dropdown from "@/utils/dropdown";
import MultiLanguageInput from "@/components/MultiLanguageInput";
// API calls are handled by the parent component

const QuestionForm = ({
  onSubmit,
  onClose,
  editing,
  questionType,
  videos = [],
  selectedVideoId,
  loading = false,
}) => {
  const [form, setForm] = useState({
    questionText_english: "",
    questionText_gujarati: "",
    questionText_hindi: "",
    correctAnswer_english: "",
    correctAnswer_gujarati: "",
    correctAnswer_hindi: "",
    section: "first",
    videoId: selectedVideoId || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) {
      setForm({
        questionText_english:
          editing.questionTextMultiLang?.english ||
          editing.questionText?.english ||
          "",
        questionText_gujarati:
          editing.questionTextMultiLang?.gujarati ||
          editing.questionText?.gujarati ||
          "",
        questionText_hindi:
          editing.questionTextMultiLang?.hindi ||
          editing.questionText?.hindi ||
          "",
        correctAnswer_english:
          editing.correctAnswerMultiLang?.english ||
          editing.correctAnswer?.english ||
          "",
        correctAnswer_gujarati:
          editing.correctAnswerMultiLang?.gujarati ||
          editing.correctAnswer?.gujarati ||
          "",
        correctAnswer_hindi:
          editing.correctAnswerMultiLang?.hindi ||
          editing.correctAnswer?.hindi ||
          "",
        section: editing.section || "first",
        videoId: editing.videoId || selectedVideoId || "",
      });
    } else {
      // For new questions, set the selectedVideoId if available
      setForm((prev) => ({
        ...prev,
        videoId: selectedVideoId || prev.videoId,
      }));
    }
  }, [editing, selectedVideoId]);

  const validateForm = () => {
    const newErrors = {};

    // Validate question text in all languages
    if (!form.questionText_english.trim()) {
      newErrors.questionText_english = "English question text is required";
    }
    if (!form.questionText_gujarati.trim()) {
      newErrors.questionText_gujarati = "Gujarati question text is required";
    }
    if (!form.questionText_hindi.trim()) {
      newErrors.questionText_hindi = "Hindi question text is required";
    }

    // Validate correct answer in all languages
    if (!form.correctAnswer_english.trim()) {
      newErrors.correctAnswer_english = "English correct answer is required";
    }
    if (!form.correctAnswer_gujarati.trim()) {
      newErrors.correctAnswer_gujarati = "Gujarati correct answer is required";
    }
    if (!form.correctAnswer_hindi.trim()) {
      newErrors.correctAnswer_hindi = "Hindi correct answer is required";
    }

    // Validate video selection for video questions
    if (questionType === "video" && !form.videoId) {
      newErrors.videoId = "Please select a video";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Just call onSubmit - let the parent handle the API calls
    onSubmit(form);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Prepare video options for dropdown
  const videoOptions = videos.map((video) => ({
    value: video._id,
    label: video.titleMultiLang?.english || video.title || "Untitled Video",
  }));

  // Section options for daily questions
  const sectionOptions = [
    { value: "first", label: "First Section" },
    { value: "second", label: "Second Section" },
  ];

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video Selection (only for video questions) */}
        {questionType === "video" && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Video Selection
            </h3>
            <div>
              <Dropdown
                label="Select Video"
                options={videoOptions}
                value={form.videoId}
                onChange={(value) => handleInputChange("videoId", value)}
              />
              {errors.videoId && (
                <p className="text-amber-600 text-sm mt-1">{errors.videoId}</p>
              )}
            </div>
          </div>
        )}

        {/* Section Selection (only for daily questions) */}
        {questionType === "daily" && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Daily Question Section
            </h3>
            <div>
              <Dropdown
                label="Section"
                options={sectionOptions}
                value={form.section}
                onChange={(value) => handleInputChange("section", value)}
              />
            </div>
          </div>
        )}

        {/* Question Text - Multi-Language */}
        <MultiLanguageInput
          label="Question Text"
          icon="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          values={{
            questionText_english: form.questionText_english,
            questionText_gujarati: form.questionText_gujarati,
            questionText_hindi: form.questionText_hindi,
          }}
          onChange={(values) => {
            setForm((f) => ({
              ...f,
              questionText_english: values.questionText_english,
              questionText_gujarati: values.questionText_gujarati,
              questionText_hindi: values.questionText_hindi,
            }));
          }}
          errors={errors}
          type="textarea"
          rows={3}
        />

        {/* Correct Answer - Multi-Language */}
        <MultiLanguageInput
          label="Correct Answer"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          values={{
            correctAnswer_english: form.correctAnswer_english,
            correctAnswer_gujarati: form.correctAnswer_gujarati,
            correctAnswer_hindi: form.correctAnswer_hindi,
          }}
          onChange={(values) => {
            setForm((f) => ({
              ...f,
              correctAnswer_english: values.correctAnswer_english,
              correctAnswer_gujarati: values.correctAnswer_gujarati,
              correctAnswer_hindi: values.correctAnswer_hindi,
            }));
          }}
          errors={errors}
          type="textarea"
          rows={3}
          sectionClassName="from-amber-50 to-yellow-50 border-amber-200"
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition font-semibold"
          >
            Cancel
          </button>
          <TimeButton loading={loading} type="submit">
            {editing ? "Update Question" : "Create Question"}
          </TimeButton>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
