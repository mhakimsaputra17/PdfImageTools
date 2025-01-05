import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { FileImage, UploadCloud, X, FileOutput, Download, AlertCircle, Plus, SortAsc, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutEffect from "@/components/LayoutEffect";

const cardColors = {
    preview: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    settings: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20"
};

const iconColors = {
    preview: "from-blue-500 to-cyan-500",
    settings: "from-purple-500 to-pink-500",
    upload: "from-violet-500 to-purple-500"
};

// Add new color constants for buttons
const buttonColors = {
    back: "from-blue-500 to-cyan-500",
    clear: "from-red-500 to-orange-500",
    addMore: "from-green-500 to-emerald-500",
    sort: "from-purple-500 to-pink-500",
    convert: "from-violet-500 to-purple-500"
};

const FileInputImage = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [orientation, setOrientation] = useState('portrait');
    const [pageSize, setPageSize] = useState('a4');
    const [margin, setMargin] = useState(20);
    const [sortOrder, setSortOrder] = useState('asc'); // new state for sorting
    const [mergePDF, setMergePDF] = useState(true); // Add new state for merge option

    const onDrop = useCallback((acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file =>
            ['image/jpeg', 'image/jpg'].includes(file.type) && file.size <= 25 * 1024 * 1024  // Changed from 5MB to 25MB
        );

        // Handle invalid files
        const invalidFiles = acceptedFiles.filter(file => !['image/jpeg', 'image/jpg'].includes(file.type));
        const oversizedFiles = acceptedFiles.filter(file =>
            ['image/jpeg', 'image/jpg'].includes(file.type) && file.size > 25 * 1024 * 1024  // Changed from 5MB to 25MB
        );

        if (invalidFiles.length > 0) {
            toast.error(
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-red-400" />
                    <div>
                        <p className="font-medium">Invalid file format</p>
                        <p className="text-sm text-gray-300">Only JPG/JPEG files are allowed</p>
                    </div>
                </div>,
                {
                    className: 'bg-gray-800 text-white',
                    progressClassName: 'bg-red-500',
                }
            );
        }

        if (oversizedFiles.length > 0) {
            toast.error(
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-red-400" />
                    <div>
                        <p className="font-medium">File too large</p>
                        <p className="text-sm text-gray-300">Files must be less than 25MB</p> {/* Updated error message */}
                    </div>
                </div>,
                {
                    className: 'bg-gray-800 text-white',
                    progressClassName: 'bg-red-500',
                }
            );
        }

        if (validFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
            toast.success(
                <div className="flex items-start">
                    <FileImage className="w-5 h-5 mr-2 mt-0.5 text-green-400" />
                    <div>
                        <p className="font-medium">Files added successfully</p>
                        <p className="text-sm text-gray-300">{validFiles.length} file(s) ready for conversion</p>
                    </div>
                </div>,
                {
                    className: 'bg-gray-800 text-white',
                    progressClassName: 'bg-green-500',
                }
            );
        }
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        onDrop(Array.from(e.dataTransfer.files));
    }, [onDrop]);

    const removeFile = useCallback((fileName) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    }, []);

    const handleConvertToPDF = useCallback(async () => {
        setIsConverting(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));
            formData.append('mergePDF', mergePDF.toString());

            const res = await fetch('/api/jpg-to-pdf', {
                method: 'POST',
                body: formData,
            });
            const blob = await res.blob();

            // Download result
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = mergePDF ? 'merged.pdf' : 'files.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
        }
        setIsConverting(false);
    }, [files, mergePDF]);

    // Add new sort handler
    const handleSort = useCallback(() => {
        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return b.name.localeCompare(a.name);
                }
                return a.name.localeCompare(b.name);
            });
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
            return newFiles;
        });
    }, [sortOrder]);

    const BackButton = () => (
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg 
            bg-gradient-to-r ${buttonColors.back} text-white mb-6 group w-full sm:w-auto 
            justify-center sm:justify-start">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
        </Link>
    );

    if (files.length > 0) {
        return (
            <section>
                <div className="custom-screen py-28">
                    <LayoutEffect className="duration-1000 delay-300"
                        isInviewState={{
                            trueState: "opacity-1",
                            falseState: "opacity-0"
                        }}
                    >
                        <div className="space-y-8">
                            <BackButton />
                            <div className="max-w-7xl mx-auto">
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-0 
    sm:justify-between mb-8">
                                    <button
                                        onClick={() => setFiles([])}
                                        className={`bg-gradient-to-r ${buttonColors.clear} text-white px-4 py-2 rounded-lg 
            hover:opacity-80 transition-all duration-300 flex items-center justify-center 
            sm:justify-start gap-2 order-1 sm:order-none`}
                                    >
                                        <X className="w-5 h-5" />
                                        <span className="whitespace-nowrap">Clear all and start over</span>
                                    </button>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 
        order-0 sm:order-none">
                                        <label
                                            htmlFor="addMoreFiles"
                                            className={`cursor-pointer bg-gradient-to-r ${buttonColors.addMore} text-white 
                px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-300 
                flex items-center justify-center gap-2`}
                                        >
                                            <Plus className="w-5 h-5" />
                                            <span className="whitespace-nowrap">Add More Files</span>
                                        </label>
                                        <button
                                            onClick={handleSort}
                                            className={`bg-gradient-to-r ${buttonColors.sort} text-white px-4 py-2 
                rounded-lg hover:opacity-80 transition-all duration-300 
                flex items-center justify-center gap-2`}
                                        >
                                            <SortAsc className={`w-5 h-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                            <span className="whitespace-nowrap">Sort by Name</span>
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="file"
                                    id="addMoreFiles"
                                    multiple
                                    accept="image/jpeg, image/jpg"
                                    onChange={(e) => onDrop(Array.from(e.target.files))}
                                    className="hidden"
                                />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Preview Panel - Takes 2 columns */}
                                    <div className="lg:col-span-2 rounded-xl border border-gray-800 bg-gray-800/50 
                                        hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm p-6 
                                        relative overflow-hidden group">
                                        {/* Animated gradient background */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                                            transition-all duration-500 bg-gradient-to-br ${cardColors.preview} 
                                            blur-xl group-hover:blur-2xl`} />

                                        <div className="relative z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-white flex items-center gap-2 
                                                    group-hover:text-transparent group-hover:bg-clip-text 
                                                    group-hover:bg-gradient-to-r from-blue-400 to-cyan-400">
                                                    <div className={`bg-gradient-to-r ${iconColors.preview} rounded-lg 
                                                        p-2 group-hover:scale-110 transition-all duration-300`}>
                                                        <FileImage className="w-5 h-5 text-white" />
                                                    </div>
                                                    Preview Images
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {files.length} {files.length === 1 ? 'file' : 'files'}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800/50">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="absolute top-2 right-2">
                                                            <button
                                                                onClick={() => removeFile(file.name)}
                                                                className="p-1.5 bg-gray-900/80 hover:bg-red-500/80 rounded-full transition-colors"
                                                            >
                                                                <X className="w-4 h-4 text-white" />
                                                            </button>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-300 truncate">{file.name}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bottom gradient line */}
                                        <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                                            transition-all duration-500 bg-gradient-to-r ${iconColors.preview}`} />
                                    </div>

                                    {/* Settings Panel */}
                                    <div className="rounded-xl border border-gray-800 bg-gray-800/50 hover:bg-gray-800/70 
                                        transition-all duration-300 backdrop-blur-sm p-6 relative overflow-hidden group">
                                        {/* Animated gradient background */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                                            transition-all duration-500 bg-gradient-to-br ${cardColors.settings} 
                                            blur-xl group-hover:blur-2xl`} />

                                        <div className="relative z-10">
                                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 
                                                group-hover:text-transparent group-hover:bg-clip-text 
                                                group-hover:bg-gradient-to-r from-purple-400 to-pink-400">
                                                <div className={`bg-gradient-to-r ${iconColors.settings} rounded-lg 
                                                    p-2 group-hover:scale-110 transition-all duration-300`}>
                                                    <FileOutput className="w-5 h-5 text-white" />
                                                </div>
                                                PDF Settings
                                            </h3>

                                            <div className="space-y-6">
                                                {/* Page Size Selection */}
                                                <div className="relative">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                                                        Page Size
                                                        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">Coming Soon</span>
                                                    </label>
                                                    <select
                                                        value={pageSize}
                                                        onChange={(e) => setPageSize(e.target.value)}
                                                        disabled
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:border-purple-500 cursor-not-allowed"
                                                    >
                                                        <option value="a4">A4 (210 × 297mm)</option>
                                                        <option value="letter">US Letter (215.9 × 279.4mm)</option>
                                                        <option value="legal">Legal (215.9 × 355.6mm)</option>
                                                    </select>
                                                </div>

                                                {/* Orientation */}
                                                <div className="relative">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                                                        Orientation
                                                        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">Coming Soon</span>
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4 opacity-50">
                                                        <button
                                                            disabled
                                                            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed"
                                                        >
                                                            Portrait
                                                        </button>
                                                        <button
                                                            disabled
                                                            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed"
                                                        >
                                                            Landscape
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Margin */}
                                                <div className="relative">
                                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                                                        Margin (mm)
                                                        <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">Coming Soon</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={margin}
                                                        onChange={(e) => setMargin(e.target.value)}
                                                        disabled
                                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 focus:outline-none focus:border-purple-500 cursor-not-allowed"
                                                    />
                                                </div>

                                                {/* Merge PDF Option */}
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id="mergePDF"
                                                        checked={mergePDF}
                                                        onChange={(e) => setMergePDF(e.target.checked)}
                                                        className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                                                    />
                                                    <label htmlFor="mergePDF" className="text-sm font-medium text-gray-300 cursor-pointer">
                                                        Merge all images in one PDF file
                                                    </label>
                                                </div>

                                                <div className="pt-6 border-t border-gray-800">
                                                    <button
                                                        onClick={handleConvertToPDF}
                                                        disabled={isConverting}
                                                        className={`w-full bg-gradient-to-r ${buttonColors.convert} text-white px-6 py-3 
                                                            rounded-lg hover:opacity-80 active:opacity-70 transition-all duration-300 
                                                            font-medium flex items-center justify-center gap-2 
                                                            disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {isConverting ? (
                                                            <>
                                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                <span>Converting...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileOutput className="w-5 h-5" />
                                                                <span>Convert Images</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <div className="mt-4 flex items-start gap-3 p-4 rounded-lg bg-purple-500/10 text-purple-400 text-sm">
                                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                        <p>Your files are processed securely on your device and never uploaded to any server.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom gradient line */}
                                        <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                                            transition-all duration-500 bg-gradient-to-r ${iconColors.settings}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LayoutEffect>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="custom-screen py-28">
                <LayoutEffect className="duration-1000 delay-300"
                    isInviewState={{
                        trueState: "opacity-1",
                        falseState: "opacity-0"
                    }}
                >
                    <div>
                        <BackButton />
                        <div className="space-y-5 max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r font-extrabold mx-auto sm:text-6xl"
                                style={{
                                    backgroundImage: "linear-gradient(179.1deg, #FFFFFF 0.77%, rgba(255, 255, 255, 0) 182.09%)"
                                }}
                            >
                                Convert JPG to PDF Easily
                            </h1>
                            <p className="max-w-xl mx-auto text-gray-300">
                                Transform your JPG images into professional PDF documents in seconds. Fast, secure, and free to use.
                            </p>
                        </div>

                        {/* File Upload Component */}
                        <div className="mt-16 sm:mt-28 max-w-3xl mx-auto">
                            <div className="w-full rounded-xl border border-gray-800 bg-gray-800/50 
                                hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm 
                                relative overflow-hidden group">
                                {/* Animated gradient background */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 
                                    transition-all duration-500 bg-gradient-to-br ${cardColors.preview} 
                                    blur-xl group-hover:blur-2xl`} />

                                {/* Drop Zone with new styling */}
                                <div className="relative z-10">
                                    <div
                                        className={`flex flex-col items-center justify-center p-8 border-2 
                                            border-dashed rounded-lg transition-all duration-300 
                                            ${isDragging
                                                ? `border-transparent bg-gradient-to-r ${iconColors.upload}`
                                                : "border-gray-700 hover:border-purple-500/50"
                                            }`}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                    >
                                        <div className={`bg-gradient-to-r ${iconColors.upload} rounded-full 
                                            p-4 mb-4 group-hover:scale-110 transition-all duration-300`}>
                                            <UploadCloud className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-xl text-gray-50 font-medium mb-2">
                                            Drop your images here
                                        </h3>
                                        <p className="text-gray-400 text-center mb-6">
                                            Drop your JPG/JPEG files here or click to browse
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/jpeg, image/jpg"
                                            onChange={(e) => onDrop(Array.from(e.target.files))}
                                            className="hidden"
                                            id="fileInput"
                                        />
                                        <label
                                            htmlFor="fileInput"
                                            className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-colors font-medium"
                                        >
                                            Select Images
                                        </label>
                                    </div>
                                    {/* ...existing error and file list... */}
                                    {error && (
                                        <div className="px-4 py-3 mx-4 mb-4 text-sm text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
                                            {error}
                                        </div>
                                    )}

                                    {/* File List and Convert Button */}
                                    {files.length > 0 && (
                                        <>
                                            <div className="mt-4 p-4 space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                                {files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3 min-w-0">
                                                            <div className="bg-purple-500/10 p-2 rounded-md shrink-0">
                                                                <FileImage className="w-4 h-4 text-purple-400" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-gray-200 text-sm font-medium truncate">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-gray-400 text-xs">
                                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(file.name)}
                                                            className="p-1.5 hover:bg-gray-700 rounded-md transition-colors ml-2 shrink-0"
                                                        >
                                                            <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add Convert Button */}
                                            <div className="p-4 border-t border-gray-800">
                                                <button
                                                    onClick={handleConvertToPDF}
                                                    disabled={isConverting}
                                                    className={`w-full bg-gradient-to-r ${buttonColors.convert} text-white px-6 py-3 
                                                        rounded-lg hover:opacity-80 active:opacity-70 transition-all duration-300 
                                                        font-medium flex items-center justify-center gap-2 
                                                        disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {isConverting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            <span>Converting...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileOutput className="w-5 h-5" />
                                                            <span>Convert to PDF</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Bottom gradient line */}
                                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                                    transition-all duration-500 bg-gradient-to-r ${iconColors.upload}`} />
                            </div>
                        </div>
                    </div>
                </LayoutEffect>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="bg-gray-800 text-white relative flex p-4 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer"
                bodyClassName="text-sm font-inter block p-3"
            />
        </section>
    );
};

export default FileInputImage;