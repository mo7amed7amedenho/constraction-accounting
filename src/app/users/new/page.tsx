"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Checkbox, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const permissionsList = [
  { label: "إدارة الحسابات", value: "accounts" },
  { label: "إدارة العمال", value: "workers" },
  { label: "إدارة العهدة", value: "custody" },
  { label: "إدارة الموردين", value: "suppliers" },
];

export default function CreateUserPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [] as string[],
  });

  const handleSubmit = async () => {
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });
    router.push("/users");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
      <Input
        size="large"
        placeholder="الاسم"
        prefix={<UserOutlined />}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <Input
        size="large"
        placeholder="البريد الإلكتروني"
        className="mt-2"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <Input.Password
        size="large"
        placeholder="كلمة المرور"
        className="mt-2"
        prefix={<LockOutlined />}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Checkbox.Group
        options={permissionsList}
        className="mt-4"
        onChange={(values) => setUser({ ...user, permissions: values })}
      />
      <Button type="primary" className="mt-4 w-full" onClick={handleSubmit}>
        حفظ
      </Button>
    </div>
  );
}
