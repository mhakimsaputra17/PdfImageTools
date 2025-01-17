import GradientWrapper from "@/components/GradientWrapper"
import LayoutEffect from "@/components/LayoutEffect"
import Link from 'next/link'
import {
    ImageDown,
    FileDown,
    FileImage,
    FileType,
    FileText,
    FileOutput,
    Eraser
} from 'lucide-react'

const features = [
    {
        title: "Compress Image",
        icon: ImageDown,
        description: "Reduce image file size without losing quality",
        route: "#",
        comingSoon: true
    },
    {
        title: "Compress PDF",
        icon: FileDown,
        description: "Optimize PDF files for easier sharing",
        route: "#",
        comingSoon: true
    },
    {
        title: "JPG to PDF",
        icon: FileImage,
        description: "Convert JPG images to PDF format",
        route: "/jpg-to-pdf",
        comingSoon: false
    },
    {
        title: "PDF to JPG",
        icon: FileOutput,
        description: "Extract images from PDF files",
        route: "#",
        comingSoon: true
    },
    {
        title: "Word to PDF",
        icon: FileType,
        description: "Convert Word documents to PDF format",
        route: "#",
        comingSoon: true
    },
    {
        title: "PDF to Word",
        icon: FileText,
        description: "Convert PDF files to editable Word documents",
        route: "#",
        comingSoon: true
    },
    {
        title: "Remove Background",
        icon: Eraser,
        description: "Remove image backgrounds automatically",
        route: "#",
        comingSoon: true
    }
]

const cardColors = [
    "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20",
    "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    "from-pink-500/20 via-rose-500/20 to-red-500/20",
    "from-indigo-500/20 via-blue-500/20 to-cyan-500/20",
    "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20"
];

const iconColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-amber-500",
    "from-green-500 to-emerald-500",
    "from-pink-500 to-red-500",
    "from-indigo-500 to-blue-500",
    "from-violet-500 to-purple-500"
];

const textColors = [
    "from-purple-400 to-pink-400",
    "from-blue-400 to-cyan-400",
    "from-orange-400 to-amber-400",
    "from-green-400 to-emerald-400",
    "from-pink-400 to-red-400",
    "from-indigo-400 to-blue-400",
    "from-violet-400 to-purple-400"
];

const FeatureCard = ({ title, icon: Icon, description, route, colorIndex, comingSoon }) => (
    <div className={`relative ${!comingSoon ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
        {comingSoon ? (
            <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden opacity-60">
                <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${iconColors[colorIndex]} rounded-lg p-3 w-fit mb-4`}>
                        <Icon className="w-8 h-8 text-white stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {description}
                    </p>
                    <span className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                        Coming Soon
                    </span>
                </div>
            </div>
        ) : (
            <Link href={route}>
                <div className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 
                    transform hover:-translate-y-2 hover:shadow-2xl border border-gray-700/50 
                    backdrop-blur-sm group relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500
                        bg-gradient-to-br ${cardColors[colorIndex]} blur-xl group-hover:blur-2xl`} />
                    <div className="relative z-10">
                        <div className={`bg-gradient-to-r ${iconColors[colorIndex]} rounded-lg p-3 w-fit mb-4 
                            group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                            <Icon className="w-8 h-8 text-white stroke-[1.5]" />
                        </div>
                        <h3 className={`text-lg font-semibold text-white mb-2 group-hover:text-transparent 
                            group-hover:bg-clip-text group-hover:bg-gradient-to-r ${textColors[colorIndex]} 
                            transition-colors duration-300`}>
                            {title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                            {description}
                        </p>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                        transition-all duration-500 bg-gradient-to-r ${iconColors[colorIndex]}`} />
                </div>
            </Link>
        )}
    </div>
)

const Hero = () => (
    <section>
        <div className="custom-screen py-28">
            <LayoutEffect className="duration-1000 delay-300"
                isInviewState={{
                    trueState: "opacity-1",
                    falseState: "opacity-0"
                }}
            >
                <div>
                    <div className="space-y-5 max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r font-extrabold mx-auto sm:text-6xl"
                            style={{
                                backgroundImage: "linear-gradient(179.1deg, #FFFFFF 0.77%, rgba(255, 255, 255, 0) 182.09%)"
                            }}
                        >
                            PdfImageTools
                        </h1>
                        <p className="max-w-xl mx-auto text-gray-300">
                            Simple tools for your PDF and image needs
                        </p>
                    </div>

                    {/* Features Section */}
                    <div className="mt-16 sm:mt-28">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {features.map((feature, idx) => (
                                <FeatureCard key={idx} {...feature} colorIndex={idx % cardColors.length} />
                            ))}
                        </div>
                    </div>
                </div>
            </LayoutEffect>
        </div>
    </section>
)

export default Hero