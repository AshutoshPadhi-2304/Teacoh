const AuthLayout = ({ children } : {children: React.ReactNode}) => {
    return (
        <div className="flex min-h-screen justify-center place-items-center bg-slate-900">
            {children}
        </div>
    )
}
export default AuthLayout;