import Head from "next/head"

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>PdfImg Tools</title>
                <meta name='description' content="PdfImageTools by mhakimsaputra - Convert your images to PDF easily with our free online tool." />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main>{children}</main>
        </>
    )
}

export default Layout