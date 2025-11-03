"use client";

import React, { useState } from "react";

type TabType = "ranking" | "history";

interface ResultTabsProps {
  /** 初期表示タブ */
  defaultTab?: TabType;

  /** 各タブのコンテンツ */
  rankingContent?: React.ReactNode;
  historyContent: React.ReactNode;
}

export default function ResultTabs({
  defaultTab = "ranking",
  rankingContent,
  historyContent,
}: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const tabs = [
    {
      id: "ranking" as const,
      label: "組み合わせランキング",
      content: rankingContent,
    },
    {
      id: "history" as const,
      label: "過去の評価履歴",
      content: historyContent,
    },
  ];

  return (
    <div className="w-full">
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-2 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? "block" : "hidden"}
          >
            {tab.content || (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">この機能は準備中です</p>
                <p className="text-xs mt-2">
                  ポケモンを選択して決定ボタンを押してください
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
