import Link from "next/link"
import Image from "next/image"

const Layout = ({children} : {children: React.ReactNode})=> {
    return(
         <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            {/* Background image with low opacity */}
            <div 
                className="absolute inset-0 opacity-[0.18]"
                style={{
                    backgroundImage: 'url("/bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/30" />
            
            <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-bold">
                    <Image src="/logo.svg" alt="logo" width={40} height={40} />
                    FluxorAI
                </Link>

                {children}
            </div>
        </div>
    )
}

export default Layout