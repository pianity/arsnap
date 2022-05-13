import { initializeArsnap } from "@/utils/arsnap";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import MetamaskButton from "@/components/interface/MetamaskButton";

export type WelcomeProps = {
    loading: boolean;
    onInitialized: () => void;
};

export default function Welcome({ loading, onInitialized }: WelcomeProps) {
    async function onMetamaskClick() {
        if (await initializeArsnap()) {
            onInitialized();
        }
    }

    return (
        <div className="w-full grow flex flex-col justify-center items-center">
            {loading ? (
                <LoadingIndicator width={40} height={40} className="opacity-40" />
            ) : (
                <div className="bg-white bg-opacity-25 rounded-xl text-center flex flex-col items-center justify-center h-[50vh] min-h-[280px] max-h-[395px] w-[90vw] max-w-[768px]">
                    <h1 className="text-2xl leading-[26px] font-semibold">Welcome!</h1>
                    <span className="text-lg leading-[20px] mt-2 mb-10">
                        Click on the button below to initialize ArSnap
                    </span>
                    <MetamaskButton label="Connect with" onClick={onMetamaskClick} />
                </div>
            )}
        </div>
    );
}
