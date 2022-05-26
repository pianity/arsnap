import { InitializationError, initializeArsnap } from "@/utils/arsnap";
import MetamaskButton from "@/components/interface/MetamaskButton";
import Text from "@/components/interface/typography/Text";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Container from "@/components/interface/layout/Container";

export type WelcomeProps = {
    onInitialized: () => void;
};

export default function Welcome({ onInitialized }: WelcomeProps) {
    async function onMetamaskClick() {
        if (!window.ethereum) {
            window.open("https://metamask.io/flask/", "_blank");
        } else {
            try {
                await initializeArsnap();
                onInitialized();
            } catch (e) {
                if (e instanceof InitializationError) {
                    if (e.kind === "WrongMetamaskVersion") {
                        window.open("https://metamask.io/flask/", "_blank");
                    }
                }
            }
        }
    }

    return (
        <ViewContainer className="justify-center">
            <Container centerAll className="h-[50vh] min-h-[280px] max-h-[395px">
                <Text.h1 size="24" taller weight="semibold">
                    Welcome!
                </Text.h1>
                <Text.span size="18" taller className="mt-2 mb-10">
                    Click on the button below to initialize ArSnap
                </Text.span>
                <MetamaskButton label="Connect with" onClick={onMetamaskClick} />
            </Container>
        </ViewContainer>
    );
}
