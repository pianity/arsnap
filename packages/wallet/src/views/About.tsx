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
                    <Text.p
                        size="18"
                        className="leading-[130%] whitespace-pre-wrap mb-5 leading-snug"
                    >
                        The ArSnap Wallet is part of the ArSnap Project, initiated by Pianity, a
                        collection of packages empowering builders and users to create and access
                        their favorite Arweave centered dApps through the already known and loved
                        MetaMask. This is made possible by the in-development MetaMask Snap feature,
                        that allows developers to extend MetaMask abilities in all sorts of way.
                    </Text.p>

                    <Text.p
                        size="18"
                        className="leading-[130%] whitespace-pre-wrap mb-10 leading-snug"
                    >
                        When we learned about this MetaMask Snap feature, we saw it as a great
                        opportunity for the Arweave ecosystem so we started building around it. The
                        end goal is to allow Arweave dApps creators to more easily expose their
                        services to users that are already familiar with the well known wallet. In
                        this spirit, the whole project is published under the permissive MIT license
                        and hosted on Github. Contributions are welcomed!
                    </Text.p>

                    <Text.h2 color="purple-light" weight="semibold" size="24" taller>
                        Documentation
                    </Text.h2>
                    <Text.p size="18" className="leading-[130%] whitespace-pre-wrap my-6">
                        Come learn more about the project and start building!
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
                    <Text.p
                        size="18"
                        className="leading-[130%] whitespace-pre-wrap my-6 leading-snug"
                    >
                        ArSnap has been created and is currently maintained by{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://pianity.com"
                            className="text-purple-text underline"
                        >
                            Pianity
                        </a>
                        , a music NFT platform operating on Arweave.
                    </Text.p>
                </div>
            </Container>
        </ViewContainer>
    );
}
