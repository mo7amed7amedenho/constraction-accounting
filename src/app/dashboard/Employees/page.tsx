"use client";
import { Table, Input, Button, Modal, Form, InputNumber } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import React from "react";

export default function EmployeesPage() {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  // 🔥 حل المشكلة: ضبط البيانات بعد تحميل الصفحة
  useEffect(() => {
    const initialEmployees = [
      { key: "1", name: "محمد أحمد", job: "مبرمج", salary: "5000" },
      { key: "2", name: "علي حسن", job: "مصمم", salary: "4500" },
      { key: "3", name: "سارة محمود", job: "محاسب", salary: "5200" },
    ];
    setEmployees(initialEmployees);
    setFilteredEmployees(initialEmployees);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredEmployees(
      employees.filter((emp) => emp.name.toLowerCase().includes(value))
    );
  };

  const handleAddEmployee = (values: any) => {
    const newEmployee = {
      key: (employees.length + 1).toString(),
      ...values,
    };
    setEmployees([...employees, newEmployee]);
    setFilteredEmployees([...employees, newEmployee]);
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    { title: "الاسم", dataIndex: "name", key: "name" },
    { title: "الوظيفة", dataIndex: "job", key: "job" },
    { title: "الراتب", dataIndex: "salary", key: "salary" },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center">إدارة الموظفين</h1>
      <div className="justify-between items-center grid grid-cols-4">
        <Input
          placeholder="بحث عن الموظف"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          className="col-span-3"
          size="large"
        />
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            إضافة موظف جديد
          </Button>
          <Button
            type="default"
            icon={<Printer />}
            onClick={() => window.print()}
          >
            طباعة
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees}
        pagination={{ pageSize: 5 }}
        className="shadow-md rounded-lg"
        bordered
        size="middle"
        locale={{ emptyText: "لا يوجد موظفين" }}
        rowKey="key"
        style={{ marginTop: "1rem" }}
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

      {isModalOpen && (
        <Modal
          title="إضافة موظف جديد"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
            <Form.Item
              name="name"
              label="اسم الموظف"
              rules={[{ required: true, message: "الرجاء إدخال اسم الموظف" }]}
            >
              <Input placeholder="أدخل اسم الموظف" />
            </Form.Item>

            <Form.Item
              name="job"
              label="الوظيفة"
              rules={[{ required: true, message: "الرجاء إدخال الوظيفة" }]}
            >
              <Input placeholder="أدخل الوظيفة" />
            </Form.Item>

            <Form.Item
              name="salary"
              label="الراتب"
              rules={[{ required: true, message: "الرجاء إدخال الراتب" }]}
            >
              <InputNumber className="w-full" placeholder="أدخل الراتب" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                إضافة الموظف
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
