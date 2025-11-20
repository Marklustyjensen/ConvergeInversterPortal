"use client";

import { useSession } from "next-auth/react";

interface AdminHeaderProps {
  onSignOut: () => void;
}

export default function AdminHeader({ onSignOut }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 w-full">
      <div className="app-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <img
              src="/images/Logo.jpg"
              alt="Converge Hospitality"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-slate-800">
                Admin Portal
              </h1>
              <p className="text-sm text-slate-500">Converge Hospitality</p>
            </div>
          </div>

          {/* Admin Badge and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Administrator
              </span>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-800">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="px-3 py-2 sm:px-4 text-sm font-medium text-slate-600 hover:text-slate-800 
                       border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
