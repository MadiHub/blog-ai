import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react'; 
import AdminLayout from "@/Layouts/AdminLayout";
import { SEO } from './SEO/Index'; 
import Swal from 'sweetalert2';

export default function Settings({ title, settings }) {
    const [activeTab, setActiveTab] = useState('seo-tab');

    useEffect(() => {
        const storedTab = localStorage.getItem('activeTab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        localStorage.setItem('activeTab', tabName);
    };

    // ALERT
    const { flash } = usePage().props;

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

    return (
        <>
        <Head>
            <link rel="icon" href={`/storage/Images/Favicon/${settings.seo[0].favicon}`} type="image/x-icon" />
            <meta name="robots" content="noindex, nofollow" />
            <meta itemprop="name" content={settings.seo[0].brand_name} />
            <meta itemprop="description" content={settings.seo[0].description} />
            <meta itemprop="image" content={`/storage/Images/BrandLogo/${settings.seo[0].brand_logo}`} />
            <title>Dashboard Settings</title>
        </Head>
        <AdminLayout>
            <div className="max-w-7xl mx-auto bg-secondary-background p-8 rounded-lg shadow-lg"> 
                <div className="grid grid-cols-1 md:grid-cols-2 items-center mb-4 mt-4">
                    <h2 className="text-3xl font-bold text-secondary-text">Settings</h2>
                </div>

                <div className="mb-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => handleTabClick('seo-tab')}
                        className={`px-6 py-2 rounded-lg transition duration-200 ease-in-out ${activeTab === 'seo-tab' ? 'bg-primary-btn text-primary-text font-semibold shadow-md' : 'bg-secondary-btn hover:bg-primary-btn hover:text-primary-text'}`}
                    >
                        SEO
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabClick('api-tab')}
                        className={`px-6 py-2 rounded-lg transition duration-200 ease-in-out ${activeTab === 'api-tab' ? 'bg-primary-btn text-primary-text font-semibold shadow-md' : 'bg-secondary-btn hover:bg-primary-btn hover:text-primary-text'}`}
                    >
                        API
                    </button>
                </div>

                {/* SEO TAB */}
                <div id="seo-tab" className={`tab-content ${activeTab === 'seo-tab' ? 'block' : 'hidden'}`}>
                    <SEO seo={settings.seo} />
                </div>
                {/* END SEO TAB */}

                {/* API TAB - You can add the API component here when ready */}
                <div id="api-tab" className={`tab-content ${activeTab === 'api-tab' ? 'block' : 'hidden'}`}>
                    <div className="p-4 border border-secondary-text rounded-lg text-secondary-text">
                        {/* <Tripay /> */}{/* Uncomment and implement your Tripay component */}
                        <p>API setting mendatang.</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
        </>
    );
}