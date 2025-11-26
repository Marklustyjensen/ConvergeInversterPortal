"use client";

interface AdminMenuTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminMenuTabs({
  activeTab,
  setActiveTab,
}: AdminMenuTabsProps) {
  const mainTabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "properties", label: "Properties" },
    { id: "documents", label: "Documents" },
    { id: "budgets", label: "Budgets" },
    { id: "messages", label: "Messages" },
  ];

  const profileTab = { id: "my profile", label: "My Profile", icon: "👤" };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-green-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
                style={
                  activeTab === tab.id
                    ? {
                        borderBottomColor: "#5c9c45",
                        color: "#5c9c45",
                      }
                    : {}
                }
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div>
            <button
              key={profileTab.id}
              onClick={() => setActiveTab(profileTab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === profileTab.id
                  ? "text-green-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
              style={
                activeTab === profileTab.id
                  ? {
                      borderBottomColor: "#5c9c45",
                      color: "#5c9c45",
                    }
                  : {}
              }
            >
              <span className="flex items-center space-x-2">
                <span>{profileTab.label}</span>
                <span>{profileTab.icon}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
