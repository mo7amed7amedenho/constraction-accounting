"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // تحميل لمدة 2 ثانية
  }, []);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-zinc-900 text-white text-3xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          جاري التحميل...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-zinc-900 text-white">
      <motion.h1
        className="text-5xl font-bold"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        مرحبا، محمد حامد 👋
      </motion.h1>

      <motion.div
        className="mt-4 text-lg text-zinc-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Typewriter
          options={{
            strings: [
              "تحكم في المصروفات والإيرادات بدقة!",
              "إدارة العهد المالية بسهولة!",
              "تقارير مالية شاملة في ثواني!",
              "أمان وسرعة في تتبع الأموال!",
            ],
            autoStart: true,
            loop: true,
            delay: 50, // سرعة الكتابة بقت أعلى (كل حرف كل 50 مللي ثانية)
            deleteSpeed: 50, // سرعة المسح بقت أعلى
          }}
        />
      </motion.div>

      <motion.div
        className="mt-10 text-zinc-400 text-center max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        هذا النظام يساعدك على تنظيم وإدارة العهد المالية داخل المشاريع، مع
        تحليلات وتقارير تفصيلية لدقة إدارة المصاريف.
      </motion.div>

      <motion.button
        className="mt-6 px-6 py-3 cursor-pointer bg-blue-500 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-600 transition-all"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={() => (window.location.href = "/dashboard")}
      >
        الدخول إلى النظام
      </motion.button>
    </div>
  );
}
