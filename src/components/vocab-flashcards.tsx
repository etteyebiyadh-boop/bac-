"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Flashcard {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  exampleSentence: string;
  bacExample: string;
  synonyms: string[];
  theme: string;
  difficulty: string;
}

interface VocabFlashcardsProps {
  language?: string;
  theme?: string;
  limit?: number;
}

export function VocabFlashcards({ language = "ENGLISH", theme, limit = 10 }: VocabFlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("language", language);
    if (theme) params.set("theme", theme);
    params.set("limit", limit.toString());

    fetch(`/api/vocabulary/flashcards?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.flashcards) {
          setFlashcards(data.flashcards);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, theme, limit]);

  const currentCard = flashcards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  }, [flashcards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  }, [flashcards.length]);

  const markMastered = useCallback(() => {
    if (currentCard) {
      setMastered(prev => new Set(prev).add(currentCard.id));
      handleNext();
    }
  }, [currentCard, handleNext]);

  const shuffle = useCallback(() => {
    setFlashcards(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ opacity: 0.5 }}>Loading flashcards...</div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📚</div>
        <h3>No flashcards available</h3>
        <p style={{ opacity: 0.7, marginTop: "8px" }}>
          Try a different language or theme.
        </p>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / flashcards.length) * 100;
  const masteredCount = mastered.size;

  return (
    <div className="stack" style={{ gap: "20px" }}>
      {/* Header */}
      <div className="row-between">
        <div>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>
            📚 VOCABULARY FLASHCARDS
          </span>
          <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
            {flashcards.length} words • {masteredCount} mastered
          </p>
        </div>
        <div className="row-between" style={{ gap: "8px" }}>
          <button
            onClick={shuffle}
            className="button-link"
            style={{ padding: "8px 16px", fontSize: "12px" }}
          >
            🔀 Shuffle
          </button>
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="button-link"
            style={{ padding: "8px 16px", fontSize: "12px", background: showQuiz ? "var(--accent)" : undefined }}
          >
            {showQuiz ? "Study Mode" : "Quiz Mode"}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            borderRadius: "2px",
            transition: "width 0.3s ease"
          }}
        />
      </div>

      {/* Flashcard */}
      <div
        onClick={handleFlip}
        className="card card-interactive"
        style={{
          padding: "40px",
          minHeight: "280px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.4s ease",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Front */}
        <div
          style={{
            backfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px"
          }}
        >
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "var(--accent)",
              marginBottom: "16px"
            }}
          >
            {currentCard.theme}
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, textAlign: "center" }}>
            {currentCard.word}
          </h2>
          <span
            style={{
              fontSize: "12px",
              color: "var(--ink-dim)",
              marginTop: "12px",
              fontStyle: "italic"
            }}
          >
            {currentCard.partOfSpeech}
          </span>
          <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "24px" }}>
            Click to flip
          </p>
        </div>

        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "40px",
            transform: "rotateY(180deg)"
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>
            {currentCard.word}
          </h3>
          <p style={{ fontSize: "14px", lineHeight: 1.5, marginBottom: "16px" }}>
            {currentCard.definition}
          </p>
          <div
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              marginBottom: "12px"
            }}
          >
            <span style={{ fontSize: "10px", color: "var(--accent)" }}>Example:</span>
            <p style={{ fontSize: "13px", fontStyle: "italic", marginTop: "4px" }}>
              &quot;{currentCard.exampleSentence}&quot;
            </p>
          </div>
          {currentCard.bacExample && (
            <div
              style={{
                padding: "12px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "8px",
                borderLeft: "3px solid var(--accent)"
              }}
            >
              <span style={{ fontSize: "10px", color: "var(--accent)" }}>BAC Context:</span>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                {currentCard.bacExample}
              </p>
            </div>
          )}
          {currentCard.synonyms && currentCard.synonyms.length > 0 && (
            <p style={{ fontSize: "12px", color: "var(--ink-dim)", marginTop: "12px" }}>
              Synonyms: {currentCard.synonyms.join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="row-between" style={{ gap: "12px" }}>
        <button
          onClick={handlePrev}
          className="button-link"
          style={{ flex: 1, justifyContent: "center" }}
        >
          ← Previous
        </button>
        <button
          onClick={markMastered}
          className="button-link"
          style={{
            flex: 1,
            justifyContent: "center",
            background: mastered.has(currentCard?.id) ? "var(--success)" : undefined
          }}
        >
          {mastered.has(currentCard?.id) ? "✓ Mastered" : "Mark Mastered"}
        </button>
        <button
          onClick={handleNext}
          className="button-link"
          style={{ flex: 1, justifyContent: "center" }}
        >
          Next →
        </button>
      </div>

      {/* Card Counter */}
      <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
        {currentIndex + 1} / {flashcards.length}
      </div>
    </div>
  );
}
