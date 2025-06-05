import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function ManageUsersIndex() {
  return (
    <AdminLayout>
        <div className="max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                <h2 className="text-2xl font-bold text-white">Daftar Komik</h2>
                <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                    <button className="bg-[#4F91CD] hover:bg-[#3B6FA1] text-white px-4 py-2 rounded transition cursor-pointer">
                    Primary Button
                    </button>
                </div>
            </div>

                {/* Pembungkus scroll horizontal di dalam */}
            <div className="border rounded-lg max-w-sm md:max-w-full lg:max-w-full overflow-x-auto bg-[#283243]">
                <table className="min-w-[600px] w-full text-left text-[#F5F5F5]">
                    <thead className="bg-[#3C4A5A]">
                    <tr>
                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">#</th>
                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Judul Komik</th>
                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Penulis</th>
                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Status</th>
                        <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-t border-[#4F6272] hover:bg-[#3C4A5A] transition">
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3 font-semibold">One Piece</td>
                        <td className="px-4 py-3">Eiichiro Oda</td>
                        <td className="px-4 py-3">Ongoing</td>
                        <td className="px-4 py-3 flex flex-wrap gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
                            Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition whitespace-nowrap cursor-pointer">
                            Hapus
                        </button>
                        </td>
                    </tr>
                    <tr className="border-t border-[#4F6272] hover:bg-[#3C4A5A] transition">
                        <td className="px-4 py-3">2</td>
                        <td className="px-4 py-3 font-semibold">Naruto</td>
                        <td className="px-4 py-3">Masashi Kishimoto</td>
                        <td className="px-4 py-3">Completed</td>
                        <td className="px-4 py-3 flex flex-wrap gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
                            Edit
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition whitespace-nowrap cursor-pointer">
                            Hapus
                        </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
  );
}
