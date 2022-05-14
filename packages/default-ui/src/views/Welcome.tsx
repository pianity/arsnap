import { initializeArsnap } from "@/utils/arsnap";
import LoadingIndicator from "@/components/interface/svg/LoadingIndicator";
import MetamaskButton from "@/components/interface/MetamaskButton";
import Text from "@/components/interface/typography/Text";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";

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
        <ViewContainer className="justify-center">
            {loading ? (
                <LoadingIndicator width={40} height={40} className="opacity-40 " />
            ) : (
                <Container centerAll className="h-[50vh] min-h-[280px] max-h-[395px">
                    <Text.h1 size="24" taller weight="semibold">
                        Welcome!
                    </Text.h1>
                    <Text.span size="18" taller className="mt-2 mb-10">
                        Click on the button below to initialize ArSnap
                    </Text.span>
                    <MetamaskButton label="Connect with" onClick={onMetamaskClick} />
                </Container>
            )}
        </ViewContainer>
    );
}
