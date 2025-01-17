import Head from "next/head"

const Layout = ({ children }) => {
    return (
        <>
            <Head>
                <title>PdfImg Tools</title>
                <meta name='description' content="Gain control of your business's growth with Mailgo's comprehensive marketing, automation, and email marketing platform." />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main>{children}</main>
        </>
    )
}

export default Layout