import { BackgroundGradientAnimation } from "../backgroundGradientAnimation/backgroundGradientAnimation";

function DashboardScreen() {
    return (
        <div className="min-h-screen font-sans bg-slate-950">
            <BackgroundGradientAnimation>
                <h1
                    className="text-5xl md:text-7xl font-bold mb-8 text-center tracking-tight drop-shadow-2xl"
                    style={{ color: '#ffffff', marginTop:'10%' }}
                >
                    Dashboard
                </h1>
            </BackgroundGradientAnimation>
        </div>

    );
}

export default DashboardScreen;