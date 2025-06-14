import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, Link, router } from '@inertiajs/react'
import Swal from 'sweetalert2';

export default function DashboardIndex({seo}) {

    // SWEETALERT
    const { flash } = usePage().props;

    const [shownAlert, setShownAlert] = useState(false);
    
    // ALERT 
    useEffect(() => {
        if (!shownAlert && (flash.success || flash.info || flash.error)) {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
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
        setShownAlert(true);
        }
    }, [flash, shownAlert]);
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
                router.delete("/dashboard/categories/" + id); 
            }
        });
    }
    // HANDLE DELETE END

    return (
    <>
        <Head>
            <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
            <meta name="robots" content="noindex, nofollow" />
            <meta itemprop="name" content={seo.brand_name} />
            <meta itemprop="description" content={seo.description} />
            <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
            <title>Dashboard</title>
        </Head>
        <AdminLayout>
            <div className="max-w-full text-primary-text">
                <h1>dashboard le</h1>
            </div>
        </AdminLayout>
    </>
  );
}
