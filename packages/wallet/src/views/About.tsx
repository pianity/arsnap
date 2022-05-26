import Button from "@/components/interface/Button";
import Container from "@/components/interface/layout/Container";
import ViewContainer from "@/components/interface/layout/ViewContainer";
import Text from "@/components/interface/typography/Text";

export default function About() {
    return (
        <ViewContainer>
            <Container className="py-8 px-6">
                <Text.h1 size="32" taller weight="bold" className="ml-4">
                    About ArSnap
                </Text.h1>

                <div className="w-full h-[1px] bg-purple mt-6 mb-14" />

                <div className="flex flex-col px-10">
                    <Text.p size="18" className="leading-[130%] whitespace-pre-wrap mb-14">
                        {
                            "ArSnap is a decentralized, peer-to-peer, blockchain-based, open-source, Arweave wallet management system. It is designed to be easy to use, secure, and easy to deploy. It allows you to create and manage your own Arweave wallets, and to send and receive Arweave tokens, all through the Metamask API.\n\nCode by Eyal, Felix\n- A story written by Copilot"
                        }
                    </Text.p>

                    <Text.h2 color="purple-light" weight="semibold" size="24" taller>
                        Documentation
                    </Text.h2>
                    <Text.p size="18" className="leading-[130%] whitespace-pre-wrap my-6">
                        Come check out our awesome documentation and help contribute to ArSnap!
                    </Text.p>
                    <a
                        href="https://github.com/pianity/arsnap"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button color="purple" large>
                            Access docs
                        </Button>
                    </a>

                    <Text.h2
                        color="purple-light"
                        weight="semibold"
                        size="24"
                        taller
                        className="mt-14"
                    >
                        Pianity
                    </Text.h2>
                    <Text.p size="18" className="leading-[130%] whitespace-pre-wrap my-6">
                        ArSnap has been created for the needs of{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pianity.com"
                            className="text-purple-text underline"
                        >
                            Pianity
                        </a>
                        , a music NFT platform built on Arweave.
                    </Text.p>
                </div>
            </Container>
        </ViewContainer>
    );
}
