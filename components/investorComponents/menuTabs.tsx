interface MenuTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function MenuTabs({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: MenuTabsProps) {
  const tabs = [
    { id: "overview", label: "Portfolio Overview", icon: "📊" },
    { id: "star report", label: "Star Report", icon: "📈" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "budgets", label: "Budgets", icon: "💰" },
    { id: "messages", label: "Messages", icon: "✉️" },
    { id: "my profile", label: "My Profile", icon: "👤" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 w-full">
        <div className="app-container">
          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex justify-between items-center py-4">
            <span className="text-lg font-semibold text-slate-800">
              {tabs.find((tab) => tab.id === activeTab)?.label || "Menu"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop horizontal tabs */}
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile dropdown menu */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden absolute left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="app-container py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-50 text-green-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
