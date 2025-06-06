import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';

export default function ManageUsersIndex({users}) {
     // SWEETALERT
  const { flash } = usePage().props;

  const [flashSortable, setFlashSortable] = useState({ success: null });

    // ALERT 
    useEffect(() => {
        if (flash.success || flash.info || flash.error) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        let icon = "info";
        let title = flash.info;
        if (flash.success) {
            icon = "success";
            title = flash.success;
        } else if (flash.error) {
            icon = "error";
            title = flash.error;
        }
    
        Toast.fire({ icon, title });
        }
    }, [flash]);
    // ALERT END

    // HANDLE DELETE
    function handleDelete(id, email) {
        Swal.fire({
        title: "Are you sure ?",
        text: "This data" + " (" + email + ") " + " will be deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete("/dashboard/users/" + id); 
            }
        });
    }
    // HANDLE DELETE END
  return (
    <>
        <AdminLayout>
            <div className="max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-2xl font-bold text-white">List Users</h2>
                    <div className="flex justify-start md:justify-end mt-2 md:mt-0">
                        <Link href={'/dashboard/users/create'} className="bg-primary-btn hover:bg-secondary-btn px-4 py-2 rounded-3xl transition cursor-pointer">
                            <i className="fa-solid fa-plus text-primary-text font-bold"></i>
                        </Link>
                    </div>
                </div>

                <div className="shadow-lg rounded-lg max-w-sm md:max-w-full lg:max-w-full overflow-x-auto bg-primary-background">
                    <table className="min-w-[600px] w-full text-left text-[#F5F5F5]">
                        <thead className="bg-[#1F2A3C]">
                        <tr>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">#</th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Role</th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Email</th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Name | Username</th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Created At | Updated At</th>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap border-b border-[#4F6272]">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((item, i) => (
                            <tr className="border-t border-[#4F6272] hover:bg-[#3C4A5A] transition" key={i}>
                                <td className="px-4 py-3">{i + 1}</td>
                                <td
                                    className={`px-4 py-3 font-semibold ${
                                        item.role === 'admin'
                                        ? 'text-red-600'
                                        : item.role === 'author'
                                        ? 'text-orange-500'
                                        : 'text-green-600'
                                    }`}
                                    >
                                    {item.role}
                                </td>
                                <td className="px-4 py-3">{item.email}</td>
                                <td className="px-4 py-3">
                                    {item.name}
                                    <br />
                                    {item.username}
                                </td>
                                <td className="px-4 py-3">
                                    {item.created_at}
                                    <br />
                                    {item.updated_at}
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                <Link href={"/dashboard/users/" + item.email}  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition whitespace-nowrap cursor-pointer">
                                    <i className="fa-solid fa-eye"></i>
                                </Link>
                                <Link href={"/dashboard/users/" + item.email + '/edit'}  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition whitespace-nowrap cursor-pointer">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button 
                                    onClick={() => handleDelete(item.id, item.email)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition whitespace-nowrap cursor-pointer"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    </>
  );
}
