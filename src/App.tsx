import React, { useState, useCallback } from "react";
import { Calculator, History, SunMoon, Edit3, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { evaluateExpression } from "./utils/calculator";
import { CalculationResult } from "./types";

function App() {
  const [note, setNote] = useState("");
  const [calculations, setCalculations] = useState<CalculationResult[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isPreview, setIsPreview] = useState(false);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const togglePreview = () => {
    setIsPreview((current) => !current);
  };

  const handleNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setNote(text);

      const mathRegex =
        /\b(?:(?:sin|cos|tan|sqrt|log)\s*\([^)]+\)|\d*\.?\d+(?:[-+*/^]\s*(?:\d*\.?\d+|\([^)]+\)|\b(?:pi|e)\b))*)/g;
      const matches = text.match(mathRegex);

      if (matches) {
        const newCalculations = matches
          .map((expr) => expr.trim())
          .filter((expr) => expr.length > 0)
          .map((expr) => ({
            expression: expr,
            result: evaluateExpression(expr),
            timestamp: new Date().toISOString(),
          }));
        setCalculations(newCalculations);
      } else {
        setCalculations([]);
      }
    },
    []
  );

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`p-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6" />
            <h1 className="text-xl font-bold">Text Calculator</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePreview}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } flex items-center gap-2`}
              title={
                isPreview ? "Switch to edit mode" : "Switch to preview mode"
              }
            >
              {isPreview ? (
                <Edit3 className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <SunMoon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 flex gap-4 mt-4">
        {/* Note Taking Area */}
        <div className="flex-grow">
          {isPreview ? (
            <div
              className={`w-full h-[calc(100vh-12rem)] p-4 rounded-lg overflow-auto ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border prose ${
                theme === "dark" ? "prose-invert" : ""
              } max-w-none`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{note}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="Start typing your notes with Markdown formatting. Try mathematical expressions like '2 + 2', 'sin(pi/2)', 'sqrt(16)', or '2^3'..."
              className={`w-full h-[calc(100vh-12rem)] p-4 rounded-lg font-mono ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          )}
        </div>

        {/* Calculations Sidebar */}
        <div
          className={`w-80 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-4 rounded-lg shadow-lg`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <History className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Calculations</h2>
          </div>

          {calculations.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No calculations yet. Try expressions like "2 + 2", "sin(pi/2)", or
              "sqrt(16)".
            </p>
          ) : (
            <div className="space-y-3">
              {calculations.map((calc, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="text-sm font-mono">{calc.expression}</div>
                  <div className="text-lg font-bold">{calc.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
