import { useEffect, useState } from "react";
import type { Tab, TabsProps } from "./types";
import styles from "./Tabs.module.css";
import cn from "classnames";

export function Tabs({ tabs, defaultTab, "data-testid": dataTestId, onChange }: TabsProps) {
    const [activeTab, setActiveTab] = useState<string | undefined>(defaultTab ? defaultTab : tabs[0].key);
    
    const handleTabClick = (tab: Tab) => {
        if (tab.disabled) return;
        setActiveTab(tab.key);
        tab.onClick?.();
    };

    useEffect(() => {
        if (!activeTab) {
          return;  
        }

        onChange?.(activeTab);
    }, [activeTab]);

    return (
        <div className={styles["tabs-container"]} data-testid={dataTestId}>
            {tabs.map((tab) => (
                <button 
                    key={tab.key} 
                    className={cn(styles["tab"], { [styles["tab--active"]]: activeTab === tab.key })} 
                    disabled={tab.disabled} 
                    onClick={() => handleTabClick(tab)} 
                    data-testid={`${dataTestId}_${tab.key}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}