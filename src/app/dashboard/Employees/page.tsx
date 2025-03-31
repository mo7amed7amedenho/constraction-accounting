"use client";
import { Table, Input, Button, Form } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { DownloadCloud, Printer } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";

export default function EmployeesPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredEmployees(
      employees.filter((emp) => emp.name.toLowerCase().includes(value))
    );
  };

  const columns = [
    { title: "الاسم", dataIndex: "name", key: "name" },
    { title: "الوظيفة", dataIndex: "job", key: "job" },
    { title: "اليومية", dataIndex: "salary", key: "salary" },
    { title: "رقم الهاتف", dataIndex: "phone", key: "phone" },
    { title: "الرقم القومي", dataIndex: "natId", key: "natId" },
    { title: "", dataIndex: "actions", key: "actions" },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">إدارة الموظفين</h1>
      <div className="items-center grid grid-cols-3">
        <Input
          placeholder="بحث عن الموظف"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          className="col-span-2"
        />
        <div className="flex items-center gap-2 mx-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            إضافة موظف
          </Button>
          <Button
            type="default"
            icon={<Printer />}
            onClick={() => window.print()}
          >
            طباعة
          </Button>
          <Button
            type="default"
            icon={<DownloadCloud />}
            onClick={() => window.print()}
          >
            CSV
          </Button>
        </div>
      </div>
      <Card>
      <Table
        columns={columns}
        dataSource={filteredEmployees}
        pagination={{ pageSize: 10 }}
        className="shadow-md rounded-lg"
     
        rowKey="key"
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>عدد الموظفين</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {filteredEmployees.length}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      </Card>
    </div>
  );
}
