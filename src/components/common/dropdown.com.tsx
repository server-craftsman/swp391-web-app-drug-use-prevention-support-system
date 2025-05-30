import React, { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, message, Space } from "antd";

interface DropdownComponentProps {
  items: MenuProps["items"];
  value?: string;
  onChange?: (key: string) => void;
  placeholder?: string;
}

// Type guard lọc item có label & key (an toàn)
function isMenuItem(
  item: any
): item is { label: React.ReactNode; key: React.Key } {
  return (
    item !== null &&
    typeof item === "object" &&
    "label" in item &&
    "key" in item &&
    typeof item.key === "string"
  );
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  items,
  value,
  onChange,
  placeholder = "Chọn mục",
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(placeholder);

  // Lọc các item có label & key
  const safeItems = (items ?? []).filter(isMenuItem);

  useEffect(() => {
    if (!value) {
      setSelectedLabel(placeholder);
      return;
    }
    const selectedItem = safeItems.find((item) => item.key === value);
    setSelectedLabel(
      selectedItem && typeof selectedItem.label === "string"
        ? selectedItem.label
        : placeholder
    );
  }, [value, safeItems, placeholder]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    message.info(`Bạn chọn mục có key: ${e.key}`);
    setOpen(false);
    if (onChange) onChange(e.key);
  };

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  return (
    <Space wrap>
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["click"]}
      >
        <Button>
          <Space>
            {selectedLabel}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default DropdownComponent;
