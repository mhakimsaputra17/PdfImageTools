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
        route: "/compress-image"
    },
    {
        title: "Compress PDF",
        icon: FileDown,
        description: "Optimize PDF files for easier sharing",
        route: "/compress-pdf"
    },
    {
        title: "JPG to PDF",
        icon: FileImage,
        description: "Convert JPG images to PDF format",
        route: "/jpg-to-pdf"
    },
    {
        title: "PDF to JPG",
        icon: FileOutput,
        description: "Extract images from PDF files",
        route: "/pdf-to-jpg"
    },
    {
        title: "Word to PDF",
        icon: FileType,
        description: "Convert Word documents to PDF format",
        route: "/word-to-pdf"
    },
    {
        title: "PDF to Word",
        icon: FileText,
        description: "Convert PDF files to editable Word documents",
        route: "/pdf-to-word"
    },
    {
        title: "Remove Background",
        icon: Eraser,
        description: "Remove image backgrounds automatically",
        route: "/remove-background"
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

const FeatureCard = ({ title, icon: Icon, description, route, colorIndex }) => (
    <Link href={route}>
        <div className="p-6 rounded-xl bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 
            transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-gray-700/50 
            backdrop-blur-sm group relative overflow-hidden">
            {/* Animated gradient background on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500
                bg-gradient-to-br ${cardColors[colorIndex]} blur-xl group-hover:blur-2xl`} />

            {/* Card content */}
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

            {/* Bottom gradient line animation */}
            <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full 
                transition-all duration-500 bg-gradient-to-r ${iconColors[colorIndex]}`} />
        </div>
    </Link>
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
                            Transform Your Files with Professional Tools
                        </h1>
                        <p className="max-w-xl mx-auto text-gray-300">
                            Professional-grade tools to convert, compress, and optimize your files. Simple, fast, and secure.
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