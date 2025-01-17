import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { FileText, UploadCloud, X, Download, AlertCircle, Plus, SortAsc, ArrowLeft, FileCheck2 } from 'lucide-react';
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

const FileInputPdf = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [mergePDF, setMergePDF] = useState(true);

    const onDrop = useCallback((acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file =>
            file.type === 'application/pdf' && file.size <= 50 * 1024 * 1024  // 50MB limit for PDFs
        );

        // Handle invalid files
        const invalidFiles = acceptedFiles.filter(file => file.type !== 'application/pdf');
        const oversizedFiles = acceptedFiles.filter(file =>
            file.type === 'application/pdf' && file.size > 50 * 1024 * 1024
        );

        if (invalidFiles.length > 0) {
            toast.error(
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-red-400" />
                    <div>
                        <p className="font-medium">Invalid file format</p>
                        <p className="text-sm text-gray-300">Only PDF files are allowed</p>
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
                        <p className="text-sm text-gray-300">Files must be less than 50MB</p>
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
                    <FileText className="w-5 h-5 mr-2 mt-0.5 text-green-400" />
                    <div>
                        <p className="font-medium">Files added successfully</p>
                        <p className="text-sm text-gray-300">{validFiles.length} PDF file(s) ready for processing</p>
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
            files.forEach(file => formData.append('pdfFile', file));
            formData.append('mergePDF', mergePDF.toString());

            const res = await fetch('/api/pdf-to-jpg', {
                method: 'POST',
                body: formData,
            });
            const blob = await res.blob();

            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = mergePDF ? 'converted_images.zip' : 'all_converted.zip';
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
                                    accept="application/pdf"
                                    onChange={(e) => onDrop(Array.from(e.target.files))}
                                    className="hidden"
                                />

                                <div className="rounded-xl border border-gray-800 bg-gray-800/50 
                                    hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm p-6 
                                    relative overflow-hidden group">
                                    {/* File List */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                PDF Files
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {files.length} {files.length === 1 ? 'file' : 'files'}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {files.map((file, idx) => (
                                                <div key={idx} 
                                                    className="flex items-center justify-between p-3 rounded-lg 
                                                        bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                                                    <div className="flex items-center space-x-3 min-w-0">
                                                        <div className="bg-purple-500/10 p-2 rounded-md">
                                                            <FileText className="w-4 h-4 text-purple-400" />
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
                                                        className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                                                    >
                                                        <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-800">
                                            <button
                                                onClick={handleConvertToPDF}
                                                disabled={isConverting}
                                                className={`w-full bg-gradient-to-r ${buttonColors.convert} text-white 
                                                    px-6 py-3 rounded-lg hover:opacity-80 transition-all duration-300 
                                                    font-medium flex items-center justify-center gap-2`}
                                            >
                                                {isConverting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FileCheck2 className="w-5 h-5" />
                                                        <span>Process PDFs</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
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
                                Process PDF Files Easily
                            </h1>
                            <p className="max-w-xl mx-auto text-gray-300">
                                Upload your PDF files to process them quickly and securely. Fast, reliable, and free to use.
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
                                            Drop your PDFs here
                                        </h3>
                                        <p className="text-gray-400 text-center mb-6">
                                            Drop your PDF files here or click to browse
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept="application/pdf"
                                            onChange={(e) => onDrop(Array.from(e.target.files))}
                                            className="hidden"
                                            id="fileInput"
                                        />
                                        <label
                                            htmlFor="fileInput"
                                            className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-colors font-medium"
                                        >
                                            Select PDFs
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
                                                                <FileText className="w-4 h-4 text-purple-400" />
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
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileCheck2 className="w-5 h-5" />
                                                            <span>Process PDFs</span>
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

export default FileInputPdf;