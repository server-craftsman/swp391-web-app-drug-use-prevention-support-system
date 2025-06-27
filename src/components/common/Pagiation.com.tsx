import React from "react";
import { Pagination } from "antd";

interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

const CustomPagination: React.FC<PaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
}) => {
  return (
    <div className="flex justify-center mt-4">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomPagination;
