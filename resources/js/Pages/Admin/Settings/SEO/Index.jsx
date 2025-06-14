import React, { useState, useEffect, useCallback } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export function SEO({ seo }) {

const { errors } = usePage().props
  const { data, setData, reset } = useForm({
        brand_name: seo[0]?.brand_name || '', 
        brand_logo: null, 
        favicon: null, 
        main_url: seo[0]?.main_url || '',
        description: seo[0]?.description || '', 
    });

    const [selectedLogoPreview, setSelectedLogoPreview] = useState(null);
    const [selectedFaviconPreview, setSelectedFaviconPreview] = useState(null);

    // Set initial image previews if data exists
    useEffect(() => {
        if (seo[0].brand_logo) {
            setSelectedLogoPreview(`/storage/Images/BrandLogo/${seo[0].brand_logo}`);
        }
        if (seo[0].favicon) {
            setSelectedFaviconPreview(`/storage/Images/Favicon/${seo[0].favicon}`);
        }
    }, [seo[0].brand_logo, seo[0].favicon]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setData('brand_logo', file);
        } else {
            setSelectedLogoPreview(null); // Clear preview if no file selected
            setData('brand_logo', null);
        }
    };

    const handleFaviconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFaviconPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setData('favicon', file);
        } else {
            setSelectedFaviconPreview(null); // Clear preview if no file selected
            setData('favicon', null);
        }
    };

    function submit(e) {
        e.preventDefault();
        router.post(`/dashboard/settings/seo/${seo[0].id}`, {
            _method: 'put',
            ...data,
        });
    }

    // SWEETALERT
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
    // END SWEETALERT

   const handleReset = useCallback(() => {
        // Reset form data to its initial state from the 'seo' prop
        setData({
            brand_name: seo[0]?.brand_name || '',
            brand_logo: null, // File inputs should be reset to null
            favicon: null,
            main_url: seo[0]?.main_url || '',
            description: seo[0]?.description || '',
        });

        // Reset image previews to the original images or null if none
        setSelectedLogoPreview(seo[0]?.brand_logo ? `/storage/Images/BrandLogo/${seo[0].brand_logo}` : null);
        setSelectedFaviconPreview(seo[0]?.favicon ? `/storage/Images/Favicon/${seo[0].favicon}` : null);
    }, [seo, setData]); // Dependencies: seo prop and setData
    return (
        <form onSubmit={submit} className="space-y-6 py-5"> {/* Added space-y-6 and py-5 */}
            <div>
                <label htmlFor="brand_name" className="block text-sm font-medium text-secondary-text mb-1">Brand Name</label>
                <input
                    type="text"
                    id="brand_name"
                    name="brand_name"
                    value={data.brand_name}
                    onChange={e => setData('brand_name', e.target.value)}
                    className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                />
                {errors.brand_name &&
                    <div className="alert text-red-500 text-xs mt-2">
                        {errors.brand_name}
                    </div>
                }
            </div>

            <div>
                <label htmlFor="brand_logo" className="block text-sm font-medium text-secondary-text mb-1">Brand Logo</label>
                <div className="mb-2">
                    {selectedLogoPreview && (
                        <img src={selectedLogoPreview} alt="Selected Logo" className="w-20 h-20 object-contain rounded-lg shadow-md border border-secondary-text" />
                    )}
                </div>
                <input
                    type="file"
                    id="brand_logo"
                    name="brand_logo"
                    onChange={handleLogoChange}
                    className="w-full text-secondary-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-primary-text hover:file:bg-orange-700 cursor-pointer"
                />
                {errors.brand_logo &&
                    <div className="alert text-red-500 text-xs mt-2">
                        {errors.brand_logo}
                    </div>
                }
            </div>

            <div>
                <label htmlFor="favicon" className="block text-sm font-medium text-secondary-text mb-1">Favicon</label>
                <div className="mb-2">
                    {selectedFaviconPreview && (
                        <img src={selectedFaviconPreview} alt="Selected Favicon" className="w-10 h-10 object-contain rounded-lg shadow-md border border-secondary-text" />
                    )}
                </div>
                <input
                    type="file"
                    id="favicon"
                    name="favicon"
                    onChange={handleFaviconChange}
                    className="w-full text-secondary-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-primary-text hover:file:bg-orange-700 cursor-pointer"
                />
                {errors.favicon &&
                    <div className="alert text-red-500 text-xs mt-2">
                        {errors.favicon}
                    </div>
                }
            </div>

            <div>
                <label htmlFor="main_url" className="block text-sm font-medium text-secondary-text mb-1">Main URL</label>
                <input
                    type="text"
                    id="main_url"
                    name="main_url"
                    value={data.main_url}
                    onChange={e => setData('main_url', e.target.value)}
                    className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text"
                />
                {errors.main_url &&
                    <div className="alert text-red-500 text-xs mt-2">
                        {errors.main_url}
                    </div>
                }
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary-text mb-1">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className="w-full px-4 py-2 border border-secondary-text rounded-lg transition focus:outline-none focus:ring-1 focus:ring-secondary-text text-secondary-text min-h-[100px]" // Added min-h
                />
                {errors.description &&
                    <div className="alert text-red-500 text-xs mt-2">
                        {errors.description}
                    </div>
                }
            </div>

            <div className="flex justify-end space-x-3 mt-15">
                <button
                   type="button"
                    onClick={handleReset}

                    className="flex items-center bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200"
                    >
                    Reset
                </button>

                <button
                    type="submit"
                    className="flex items-center bg-primary-btn text-primary-text font-bold py-2 px-4 rounded-lg hover:bg-secondary-btn transition-all duration-200"
                >
                    <i className="fa fa-save mr-2"></i>
                    <span>Save Changes</span>
                </button>
            </div>
        </form>
    );
}