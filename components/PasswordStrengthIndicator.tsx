"use client";

import React from "react";
import { validatePassword } from "../lib/passwordValidation";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const validation = validatePassword(password);

  // Calculate strength based on how many requirements are met
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
    {
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      text: "One special character",
    },
  ];

  const metRequirements = requirements.filter((req) =>
    req.regex.test(password)
  );
  const strength = metRequirements.length;

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (strength <= 1) return "Very Weak";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  if (password.length === 0) return null;

  return (
    <div className="mt-2">
      {/* Strength bar */}
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xs text-slate-600 min-w-0">
          Password strength:
        </span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <span
          className={`text-xs font-medium ${
            strength >= 5
              ? "text-green-600"
              : strength >= 4
                ? "text-blue-600"
                : strength >= 3
                  ? "text-yellow-600"
                  : strength >= 2
                    ? "text-orange-600"
                    : "text-red-600"
          }`}
        >
          {getStrengthText()}
        </span>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req, index) => {
            const isMet = req.regex.test(password);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full flex items-center justify-center ${
                    isMet ? "bg-green-500 text-white" : "bg-gray-300"
                  }`}
                >
                  {isMet && (
                    <svg
                      className="w-2 h-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    isMet ? "text-green-600" : "text-slate-500"
                  }`}
                >
                  {req.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
